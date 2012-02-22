from jsonrpc import ServiceMethod
import inspect
class ServiceProvider(object):
    def get_all_methods(self):
        default_methods=['__class__', '__delattr__', '__format__', '__getattribute__', '__hash__', '__init__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__']
        methods=[method for method in dir(self) if callable(getattr(self, method)) and method not in default_methods]
        return methods 
    @ServiceMethod
    def register(self):
        return True
    @ServiceMethod
    def parse_request(self, methodname, methodargs):
        if methodname in self.get_all_methods():
            args=self.get_arguments_for_methodname(methodname)
            for arg in args:
                if arg not in methodargs:
                    return "argument %s is not provided" % arg
            requested_method=getattr(self,methodname)
            function_list={methodname:requested_method}
            return function_list[methodname](**methodargs)
        else:
            return "method not found"
    @ServiceMethod
    def get_available_methods(self):
        return self.get_all_methods()
    @ServiceMethod
    def get_arguments_for_methodname(self, methodname):
        if methodname in self.get_all_methods():
            requested_method=getattr(self,methodname)
            args, _, _, values = inspect.getargspec(requested_method)
            args_without_self=[arg for arg in args if arg != "self"]
            return args_without_self
        else:
            return "method not found"
