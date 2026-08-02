<!-- #ejs Mate is use where we do not want to change the navbar if we want any stable thing ex we want navbar on every every page then we use ejs mate  -->

<!-- wrap async is the another good way of writing try and catch  through which errors can be handled-->

<!-- function wrapAsync(fn){
return function(req,res,next)
{
fn(req,res,next).catch(next);
}
} -->

                                    cardianility

relationships --> 1.one to one 1x1
2.one to many 1xn
3.many to many nxn

foreign keys plays a important role in sql. forign key is the key which maintains relationship between two tables one tables's primary key is another table's foreign k ey.

what is session -> session means how many times our client is interact with server .
session mangament--> jbb hmm kisi site prr jake kuch chize apne cart m add krte h aur next page prr jate h toh bhi vo chiz browser ko yaad rahe usse session managment kehte h ..

there are two types of states--> 1.stateful protocol -> required server to save the status and sesssion information for ex- ftp or upi transaction

2.stateless protocol-> does not require the server to retain the server information or session infirmation.
for ex- http or cash transaction

cookies are sighned as welll ass unsighned --> to save cookie from temoeraing we use signed cookie

auhentication and authorization
authentication--> is the process of verifying who someone is
authorization--> is the process of verifying what specific applications, files and data a use rhas to access

we never store password as it is instead we store there hashed form.

characteristics of hashing

1.  for every input there is a fixed output
2.  they are one-way functions ,we cant get input from outhput.means we cant get to know about the pasword by seeing its hashed form and there is no way to convert hashed form onto original password so there is security of your passwprds if the site is get hacked.

Yeh ek one-way process hota hai — matlab:

Tum original input se hash asaani se bana sakte ho ✅

Lekin hash se wapas original input pata karna mushkil hota hai ❌

3.  for a different input, ther eis different output but of same length
    small changes in input should bring large changes in output.

well known hashing functions-> SHA-256

salting -> password salting is the process to protect passwords stored in databases by adding a strign of 32 or more characters and then hashing them. these are characters are special characters most of the time.
for ex-helloworld%?@ where %?@ is the salting and the hashed form of this example cant be track by the hacker easily.

reverse lookup table can be use by the hackers to hack the passwords. reverse lookup table are like

passport is used for authentication...

we have use MVC model in this project full form-> models views controllers

starablity is the rating styling that we use for star ratings.

how to save upload image?

1.form capable of sending files. 2.
2.mongox third party service--> save file (this provide us the url link)
3.save the link in mongo

we have use geojason in mongoose to save the geo locations ,mapbox,mapbox github for accessing locations.


