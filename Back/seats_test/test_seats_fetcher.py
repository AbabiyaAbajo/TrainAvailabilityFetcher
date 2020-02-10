import unittest
import mock

from fetching_train_info.seats_fetcher import get_seats
from jsonrpcclient.response import Response


class MyTestCase(unittest.TestCase):
    @mock.patch('fetching_train_info.seats_fetcher.HTTPClient.send')
    def test_good_response(self, mock_client):

        event_mock = {
            'queryStringParameters': {
                'origin': 8302026,
                'destination': 8302044,
                'date': u'9/10/2019, 12:00:00 AM',
                'time': 796,
                'train': u'8517'
            }
        }

        full_data = {
            'body': '{"0810300ITA": {"I": {"seats": 0, "price": 17.9}, "W": {"seats": 0, '
                    '"price": 23.9}}, "0810600ITA": {"I": {"seats": 0, "price": 15.9}, '
                    '"W": {"seats": 0, "price": 19.9}}, "0810700ITA": {"I": {"seats": 0, '
                    '"price": 16.9}, "W": {"seats": 0, "price": 19.9}}, "0810110ITA": '
                    '{"I": {"seats": 0, "price": 14.9}, "W": {"seats": 0, "price": '
                    '18.9}}, "0100100ITA": {"I": {"seats": 326, "price": 21.5}, "W": '
                    '{"seats": 98, "price": 29.0}}, "0810500ITA": {"I": {"seats": 0, '
                    '"price": 15.9}, "W": {"seats": 0, "price": 18.9}}, "0810200ITA": '
                    '{"I": {"seats": 0, "price": 17.9}, "W": {"seats": 0, "price": '
                    '22.9}}, "0810010ITA": {"I": {"seats": 0, "price": 17.9}, "W": '
                    '{"seats": 0, "price": 21.9}}, "0810800ITA": {"I": {"seats": 0, '
                    '"price": 16.9}, "W": {"seats": 0, "price": 20.9}}}',
            'headers': {'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'statusCode': 200
        }

        mock_client.side_effect = self.check_request

        resp = get_seats(event_mock, '')

        self.assertEqual(resp, full_data)

    @mock.patch('fetching_train_info.seats_fetcher.HTTPClient.send')
    def test_bad_response(self, mock_client):

        event_mock = {
            'queryStringParameters': {
                'origin': 8302026,
                'destination': 8302044,
                'date': u'9/10/2019, 12:00:00 AM',
                'time': 'hi',
                'train': u'8517'
            }
        }

        bad_data = {
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'statusCode': 400}

        mock_client.side_effect = self.check_request

        resp = get_seats(event_mock, '')

        self.assertEqual(resp, bad_data)

    def check_request(self, request, *args, **kwargs):

        data_seats = {"0810300ITA": {"I": 0, "W": 0}, "0810600ITA": {"I": 0, "W": 0}, "0810700ITA": {"I": 0, "W": 0}, "0810110ITA": {"I": 0, "W": 0}, "0100100ITA": {"I": 326, "W": 98}, "0810500ITA": {"I": 0, "W": 0}, "0810200ITA": {"I": 0, "W": 0}, "0810010ITA": {"I": 0, "W": 0}, "0810800ITA": {"I": 0, "W": 0}}
        data_price = {"0810300ITA": {"I": 17.9, "W": 23.9}, "0810600ITA": {"I": 15.9, "W": 19.9}, "0810700ITA": {"I": 16.9, "W": 19.9}, "0810110ITA": {"I": 14.9, "W": 18.9}, "0100100ITA": {"I": 21.5, "W": 29.0}, "0810500ITA": {"I": 15.9, "W": 18.9}, "0810200ITA": {"I": 17.9, "W": 22.9}, "0810010ITA": {"I": 17.9, "W": 21.9}, "0810800ITA": {"I": 16.9, "W": 20.9}}

        class MockData:

            def __init__(self, result):
                self.result = result

        res_seats = Response('')
        res_price = Response('')
        res_seats_data = MockData(data_seats)
        res_price_data = MockData(data_price)
        res_seats.data = res_seats_data
        res_price.data = res_price_data

        if request['method'] == 'get_availability':
            return res_seats
        elif request['method'] == 'get_price':
            return res_price
