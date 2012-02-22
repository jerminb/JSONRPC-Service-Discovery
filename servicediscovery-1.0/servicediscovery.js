var ServiceDiscovery=
{
    version:"1.0.0"
};
ServiceDiscovery.EntryPoint = function ( entryPoint )
{
    this.__entryPoint = entryPoint;
    this.__entryProxy = new JsonRpc.ServiceProxy( this.__entryPoint , {
            asynchronous: false,
            methods: ['available_services']
        });
    this.init = function ()
    {
        try
        {
            this.__availableServices = this.__entryProxy.available_services();
        }
        catch (e) 
        {
            throw e;
        }
    }
    this.getAvailableServices = function ()
    {
        return this.__availableServices;
    }
    this.getServiceForServiceID = function (serviceID)
    {
        var serviceWithServiceID = [];
        for (var i=0; i<this.__availableServices.length; i++)
        {
            service=this.__availableServices[i];
            if(service.service_id == serviceID)
               serviceWithServiceID.push(service); 
        }
        return serviceWithServiceID;
    }
    function searchServiceForKeywords(service, keywords)
    {
        for(var i=0;i<keywords.length;i++)
        {
            keyword = keywords[i];
            if(service.service_name.indexOf(keyword)>-1)
                return true;
            for(var key in service.service_meta_data)
            {
                if(service.service_meta_data[key].indexOf(keyword)>-1)
                    return true;
            }
            if(service.service_description.indexOf(keyword)>-1)
                return true;
        }
        return false;
    }
    this.findServiceForKeywords = function (keywords)
    {
        var servicesForKeywords = [];
        for (var i=0; i<this.__availableServices.length; i++)
        {
            service=this.__availableServices[i];
            if(searchServiceForKeywords(service, keywords))
               servicesForKeywords.push(service);
        }
        return servicesForKeywords;
    }
}
ServiceDiscovery.Service = function (serviceRecord, options)
{
    this.__serviceRecord=serviceRecord;
    var serviceProxyOptions = {methods: ['register','parse_request','get_available_methods','get_arguments_for_methodname']};
    if (options instanceof Object)
    {
       if (options.asynchronous !== undefined) {
            serviceProxyOptions.asynchronous = !!options.asynchronous;
        }
    }
    this.__serviceProxy = new JsonRpc.ServiceProxy( this.__serviceRecord.service_url , serviceProxyOptions);
    this.register = function(onSuccess, onError)
    {
        if(onSuccess != null && onError!=null)
        {
            JsonRpc.setAsynchronous(this.__serviceProxy, true);
            this.__serviceProxy.register({
                params:[],
                onSuccess: onSuccess,
                onException: onError
            });
        }
        else if(onSuccess == null && onError==null)
        {
            try 
            {
                JsonRpc.setAsynchronous(this.__serviceProxy, false);
                var result = this.__serviceProxy.register();
                return result;
            } 
            catch (e) 
            {
                throw e;
            }
        }
        else
        {
            throw "Call is asynchronous but one of the Callback functions is missing";
        }
    }
    this.parse_request = function(methodName, methodParams, onSuccess, onError)
    {
        if(onSuccess != null && onError!=null)
        {
            JsonRpc.setAsynchronous(this.__serviceProxy, true);
            this.__serviceProxy.parse_request({
                params:[methodName, methodParams],
                onSuccess: onSuccess,
                onException: onError
            });
        }
        else if(onSuccess == null && onError==null)
        {
            try 
            {
                JsonRpc.setAsynchronous(this.__serviceProxy, false);
                var result = this.__serviceProxy.parse_request(methodName, methodParams);
                return result;
            } 
            catch (e) 
            {
                throw e;
            }
        }
        else
        {
            throw "Call is asynchronous but one of the Callback functions is missing";
        }
    }
    this.get_available_methods = function(onSuccess, onError)
    {
        if(onSuccess != null && onError!=null)
        {
            JsonRpc.setAsynchronous(this.__serviceProxy, true);
            this.__serviceProxy.get_available_methods({
                params:[],
                onSuccess: onSuccess,
                onException: onError
            });
        }
        else if(onSuccess == null && onError==null)
        {
            try
            {
                JsonRpc.setAsynchronous(this.__serviceProxy, false);
                var result = this.__serviceProxy.get_available_methods();
                return result;
            }
            catch (e)
            {
                throw e;
            }
        }
        else
        {
            throw "Call is asynchronous but one of the Callback functions is missing";
        }
    }
    this.get_arguments_for_methodname = function(methodName, onSuccess, onError)
    {
        if(onSuccess != null && onError!=null)
        {
            JsonRpc.setAsynchronous(this.__serviceProxy, true);
            this.__serviceProxy.get_arguments_for_methodname({
                params:[methodName],
                onSuccess: onSuccess,
                onException: onError
            });
        }
        else if(onSuccess == null && onError==null)
        {
            try
            {
                JsonRpc.setAsynchronous(this.__serviceProxy, false);
                var result = this.__serviceProxy.get_arguments_for_methodname(methodName);
                return result;
            }
            catch (e)
            {
                throw e;
            }
        }
        else
        {
            throw "Call is asynchronous but one of the Callback functions is missing";
        }
    }
}
