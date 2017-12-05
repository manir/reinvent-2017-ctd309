# reinvent-2017-ctd309
Code used in CTD309 presentation and demo during re:Invent 2017

## CloudFront configuration
I have three cache behaviors -- default (*), index.html and "/upload/*". I use the same S3 bucket as origin for all of them.

[!alt text](CloudFront_Cache_Behaviors.png)

I then update the default root object (in the distribution page) to point to index.html.

[!alt text](CloudFront_Default_Root_Object.png)

## Uploading content

curl -v -T <filename> https://d123.cloudfront.net/upload/<filename>
