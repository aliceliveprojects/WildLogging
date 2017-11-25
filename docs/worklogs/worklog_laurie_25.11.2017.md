2017-11-25 17:53:45 

Going through wireframes and thinking about how to implement the mapping feature.

We have a backend restlet account which we are using for this. 
We are currently using postcode as a primary data point for location.
Reason is that the backend doesn't have the capability to search on location. 

If we store location as lat-lon then we will be able to search on postcode, but _plot_ on location. This might work quite well. Need to add these data points into the dataset.
