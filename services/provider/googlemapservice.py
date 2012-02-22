from servicepublisher import ServiceProvider
import urllib, urllib2
try:
    import json
except ImportError: # for Python 2.5
    import simplejson as json
class GoogleMapAPIProviderService(ServiceProvider):
    def findLatLong(self,address):
        params = {'q': address,'output': 'json', 'oe': 'utf8'}
        url = 'http://maps.google.com/maps/geo?' + urllib.urlencode(params)
        rawreply = urllib2.urlopen(url).read()
        reply = json.loads(rawreply)
        return reply['Placemark'][0]['Point']['coordinates'][:-1]
service = GoogleMapAPIProviderService()
