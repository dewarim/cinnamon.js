# Testing and Development

To run the tests in the index.html page, you need a Cinnamon 3 server.

If you use Tomcat as your application server, you can copy the content of this repository into the default ROOT application in //tomcat7/webapps/ROOT. Then, load the [test page](http://localhost:8080/index.html)

Because of the same-origin-policy, you cannot simply include cinnamon.js in a webserver on a different domain, so testing the JavaScript in a local webserver and Cinnamon 3 on a remote server will not work. You can of course put a standard Apache as a proxy server in front of Tomcat if you do not like the idea of serving JavaScript content and the static library files directly from Tomcat.

