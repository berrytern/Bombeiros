library('ggmap')
library('base64enc')
register_google(key="AIzaSyB1MhfDz7x85UyTWQEqtAnKy_4aUwt2HDI")

#* @param origem
#* @param dest
#* @param lat
#* @param lon
#* @get /
img<-function(origem="",dest="",lat, lon){
  print(lat)
  print(lon)
  trek_dt <- trek(origem,
                  dest, 
                  structure = "route")
  j <- qmap(revgeocode(c(lon = as.numeric(lon), lat = as.numeric(lat))), zoom = 15) +
    geom_path(aes(x = lon, y = lat),  colour = "blue",
              size = 1.5, alpha = .5,
              data = trek_dt, lineend = "round")
  ##ggmap(j)
  str(j, max.level=1)
  fn <- tempfile(fileext='.png')
  png(fn)
  print(j)
  dev.off()
  
  n<-base64enc::base64encode(fn)
  paste0(n)
}