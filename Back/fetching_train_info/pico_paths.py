import os

cert_path = os.path.join(os.path.dirname(__file__), os.environ["pico_client_cert"])

endpoint = os.environ["pico_url"]

channelId = os.environ["pico_channel_id"]

off_codes = [
        u'0810300ITA', u'0810010ITA', u'0810200ITA', u'0810500ITA',
        u'0810600ITA', u'0810700ITA', u'0810800ITA', u'0810110ITA',
        u'1006900ITA', u'0100100ITA', u'1711300CIS', u'1711100CIS',
        u'2511800CIS', u'2511900CIS', u'2565700CIS', u'0821010TVT',
        u'0820810TVT', u'0820510TVT', u'0820610TVT', u'0820110TVG',
        u'0820610TVG', u'0820310TVT', u'0820410TVT', u'0820810TVG',
        u'0820710TVT', u'0820410TVG', u'0820210TVT', u'0820910TVT',
        u'0820310TVG', u'0820710TVG', u'0820210TVG', u'0820110TVT']

