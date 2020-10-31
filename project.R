
library('plumber')
# 'plumber.R' is the location of the file shown above
pr("plumbler.R") %>%
  pr_run(port=8000)


##trek_df <- trek("PRATA, campina grande",
##                "MIRANTE, campina grande",
##                structure = "route")
##trek_dj <- trek("Bombeiro Militar, campina grande", 
##                "SCI -  sessao de combate a incendio, campina grande", 
##                structure = "route")
##j <- qmap("campina grande, Paraiba", zoom = 14,maptype = "hybrid") +
##  geom_path(aes(x = lon, y = lat),  colour = "green",
##            size = 1.5, alpha = .5,
##           data = trek_df, lineend = "round")+
## geom_path(aes(x = lon, y = lat),  colour = "red",
##           size = 1.5, alpha = .5,
##           ##           data = trek_dt, lineend = "round")+
## geom_path(aes(x = lon, y = lat),  colour = "blue",
##            ##           size = 1.5, alpha = .5,
##            data = trek_dj, lineend = "round")
##
##ggmap(j)
##ggsave("plot.png")
## convert image to base64 encoded string

##str(j, max.level=1)
##fn <- tempfile(fileext='.png')
##png(fn)
##print(j)
##dev.off()

##n<-base64enc::base64encode(fn)

