import React, { useEffect, useRef, useState } from "react"
import Map, {NavigationControl , Marker , Source , Layer } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import "./basemapstyle.css"
import SearchBox from './SearchBox';
import bbox from '@turf/bbox';

export default function BaseMap() {
    const [Lat , setLat] = useState()
    const [Lng , setLng] = useState()
    const [feature, setfeature ] = useState(null)
    const [map , setmap] = useState(null)
    const mapRef = useRef();


    const getfeature = (centroid , filtered_feature) => {
        // console.log(centroid)
        setLat(centroid.lat)
        setLng(centroid.lng)
        setfeature(filtered_feature)
      };
    //   console.log(feature.bbox)

    const rotateCamera = (timestamp) => {
        // mapRef.current.rotateTo((timestamp / 100) % 360, { duration: 0 });
        // requestAnimationFrame(rotateCamera);
        mapRef.current.rotateTo(200 , {duration : 5000});
        
    }

    const layerStyle = {
        
            'id': 'maine',
            'type': 'fill',
            'source': 'maine',
            'layout': {},
            'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.3
            }
    }
    // console.log(mapRef)
    if(mapRef.current && !map) {
        setmap(mapRef.current.getMap())
    }

    // if(map) {
    //     map.on('load' , () => {
    //         map.addSource("terrain" , {
    //             'type': 'raster-dem',
    //             'url': 'https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=0aOLlFlJbVuFtN4GnoS4',
    //         })

    //         map.setTerrain({
    //             source : "terrain"
    //         })
    //     })

    //     map.addControl(
    //         new maplibregl.TerrainControl({
    //         source: 'terrain',
    //         exaggeration: 1
    //         })
    //         );
    // }

    if(feature) {
      console.log("Feature" , feature)
        const bounds = bbox(feature);
        mapRef.current.fitBounds(bounds,{padding: 40, duration: 4000})
        // mapRef.current.rotateTo(180 , {duration : 7000});
        // rotateCamera(0);
        // setTimeout(rotateCamera(0), 5000);
        // console.log(mapRef.current.isMoving())
            // console.log(map)
        
        if(!mapRef.current.isMoving()) {
            rotateCamera(0);
        }
    }
    // if(mapRef.current) {
    //     console.log(mapRef.current.isMoving())
    // }
    if(map && feature ){
        console.log(map)

    map.on('idle', (e) => {
        rotateCamera(0);
    })
}
    // useState(() => {
    //     if(mapRef.current) {
    //         console.log("Hi")
    //         console.log(mapRef.current.getMap())
    //     }
    // },[mapRef])


  return (
    <div className='map-container'>
      <Map mapLib={maplibregl} 
        ref={mapRef}
        initialViewState={{
          longitude: 77.58690000000007,
          latitude: 12.966180000000065,
          zoom: 10,
          pitch : 45,
          bearing : 172,
          hash : true,
          terrain: true,
          terrainControl: true,
        }}
        style={{ height: "100%", width: "100%", borderRadius: "25px" }}
        mapStyle="https://api.maptiler.com/maps/8b93e542-04c0-4215-9b50-99e36d354c08/style.json?key=0aOLlFlJbVuFtN4GnoS4"
      >
        <NavigationControl position="bottom-right" />
        <SearchBox getfeature={getfeature}/>
        {
            Lat && Lng ? (<Marker longitude={Lng} latitude={Lat} anchor="bottom" ></Marker>) : ("")
        }
        {
            feature ? (
                <Source id="my-data" type="geojson" data={feature}>
                <Layer {...layerStyle} />
              </Source>
            ) : ("")
        }
        
      </Map>
    </div>
  )
}
