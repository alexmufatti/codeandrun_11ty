---
title: WCF ServiceHost e Cross Domain Policy
id: '2189'
date: 2010-11-08 22:54:49
tags:
- Programming
---

A volte capita di dover accedere con un’applicazione web a servizi hostati in un dominio esterno. Questo si risolve nella maggioranza dei casi impostando in maniera corretta il file `[clientaccesspolicy.xml](http://msdn.microsoft.com/en-us/library/cc197955(VS.95).aspx "clientaccesspolicy").`

Nel caso in cui però il Web Service in questione non sia hostato da un vero e proprio web server ma da un’applicazione .NET (sia essa console o form) si deve ovviare al problema della Cross Domain Policy in manera più _fantasiosa_ ((poi dicono che gli informatici non hanno fantasia :-) )) .

\_

\_Quello che sto per descrivere é un modo semplice per _simulare_ la presenza del file `clientaccesspolicy.xml` quando si ha a che fare con un ServiceHost.

Supponendo di avere già il Web Service funzionante (`MyService`), quello che resta da fare é far implementare ad esso un’interfaccia del tipo:

```csharp
[ServiceContract]
public interface IPolicyRetriever
{
    [OperationContract]
    [WebGet(UriTemplate = "/clientaccesspolicy.xml")]
    Stream GetSilverlightPolicy();
}
```

Inquesta interfaccia specifichiamo che il servizio deve rispondere quando viene interrogato l’Uri `/clientaccesspolicy.xml`.

Il gioco è fatto.

Basta ora implementare il service in un modo simile a questo:

```csharp
public Stream GetSilverlightPolicy()
{
       string result = @

                              ";
      WebOperationContext.Current.OutgoingResponse.ContentType = "application/xml";
      return new MemoryStream(Encoding.UTF8.GetBytes(result));
}
```

e creare il ServiceHost dove aggiungere i due endpoint.

```csharp
class Program
    {
        static void Main(string[] args)
        {
            Uri baseAddress = new Uri("http://localhost:9090");
            // Create the ServiceHost.
            using (ServiceHost host = new ServiceHost(typeof(MyService), baseAddress))
            {
                // Enable metadata publishing.
                ServiceMetadataBehavior smb = new ServiceMetadataBehavior();
                smb.HttpGetEnabled = true;
                smb.MetadataExporter.PolicyVersion = PolicyVersion.Policy15;
                host.Description.Behaviors.Add(smb);
                host.AddServiceEndpoint(typeof(IMyService), new BasicHttpBinding(), new Uri("http://localhost:9090/myservice.svc"));

                host.AddServiceEndpoint(typeof(IPolicyRetriever), new WebHttpBinding(), "").Behaviors.Add(new WebHttpBehavior());

                host.Open();
                Console.ReadLine();
                host.Close();
            }
        }
    }
```

Ecco fatto; il nostro client potrà accedere al WebService senza problemi.