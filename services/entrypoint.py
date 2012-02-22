from jsonrpc import ServiceMethod
try:
    import json
except ImportError: # for Python 2.5
    import simplejson as json

class ServiceAttribute(dict):
    def __init__( self, service_id, service_name, service_url, service_description="", service_class_id_list=[], service_description="", service_meta_data={} ):
        self.service_id=service_id
        self.service_name=service_name
        self.service_url=service_url
        self.service_description=service_description
        self.service_class_id_list=service_class_id_list
        self.service_description=service_description
        self.service_meta_data=service_meta_data
    def __getattr__(self, name):
        return self[str(name)]
    def __setattr__(self, name, value):
        self[str(name)]=str(value)
            
class EntryPointService(object):
    def __init__(self):
        service_attribute = ServiceAttribute("2","test provider","http://localhost/services/provider/googlemapservice.py")
        self.services_list = []
        self.services_list.append(service_attribute)
    def add_service_to_service_list(self, service):
        self.services_list.append(service)
    @ServiceMethod
    def available_services(self):
        return self.services_list

service = EntryPointService()
