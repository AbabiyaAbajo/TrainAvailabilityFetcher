import datetime
import json

from jsonrpcclient.clients.http_client import HTTPClient
from jsonrpcclient.exceptions import ReceivedErrorResponseError
from jsonrpcclient.requests import Request

import logging

import pico_paths


def get_seats(event, context):
    temp_query_param = event["queryStringParameters"]
    try:
        date_data = datetime.datetime.strptime(temp_query_param["date"], "%m/%d/%Y, %H:%M:%S %p").date().toordinal()
        origin = int(temp_query_param["origin"])
        destination = int(temp_query_param["destination"])
        time = int(temp_query_param["time"])
        train = int(temp_query_param["train"])

    except ValueError as e:
        logging.exception(
            "Value error received as input: >%s< data",
            e
        )

        return {
            "isBase64Encoded": False,
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            }
        }

    try:
        fetched_train_data = fetch_seat_availability(origin, destination, date_data, time, train)

        return {
            "isBase64Encoded": False,
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin" : "*"
            },
            "body": json.dumps(fetched_train_data)
        }

    except ReceivedErrorResponseError as e:
        logging.exception(
            "Unable to retrieve segment from Pico, please check the data: >%s< data",
            e
        )

        return {
            "isBase64Encoded": False,
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            }
        }


def fetch_seat_availability(departure_station, arrival_station, departure_date, departure_time, train_number):
    client = HTTPClient(pico_paths.endpoint)

    """ store into into a payload to be sent out to endpoint """
    request = Request(
        method="get_availability",
        channelId=pico_paths.channelId,
        train=train_number,
        origin=departure_station,
        destination=arrival_station,
        date=departure_date,
        time=departure_time,
        offer_codes=pico_paths.off_codes,
    )

    """ send for a response """
    seat_response = client.send(request=request, cert=pico_paths.cert_path, verify=False)

    request['method'] = "get_price"

    price_response = client.send(request=request, cert=pico_paths.cert_path, verify=False)

    merged_data = {}

    for service in seat_response.data.result:
        train_instance_data = {}
        for key, value in seat_response.data.result[service].items():
            price = price_response.data.result.get(service)
            if price is None:
                train_instance_data.update({key: {"seats": value, "price": 0}})
            else:
                train_instance_data.update({key: {"seats": value, "price": price_response.data.result[service][key]}})
        merged_data.update({service: train_instance_data})

    return merged_data
