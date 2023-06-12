import React, { useEffect, useRef, useState } from "react"
import axios from "axios";
import maplibregl from 'maplibre-gl';
import listStyle from "./searchbox.module.scss";


export default function SearchBox({getfeature}) {
    const [searchvalue , setsearchvalue] = useState("")
    const [searchresult , setsearchresult] = useState([])
    const [timer, setTimer] = useState(null)
    const [selected, setselected] = useState()
    const [feature , setfeature] = useState()
    const [marker , setmarker] = useState({})

    const handelResult = async () => {
        const options = {
            method: "GET",
            url: `https://api.maptiler.com/geocoding/${searchvalue}.json?key=0aOLlFlJbVuFtN4GnoS4&proximity=77.1461,12.2602&country=IN&autocomplete=true`,
          };
        axios(options).then((res) => {
            setsearchresult(res.data.features)
        })
    }
    const handleSearch = async (e) => {
        setsearchvalue(e.target.value)
        clearTimeout(timer)
        const newTimer = setTimeout(() => {
            handelResult()
          }, 500)
          setTimer(newTimer)
    }

    const handelNavigate = async (place) => {
        setselected(place)
        setsearchresult([])
        console.log(place)
        const placeId = place.id
        const options = {
            method : "GET",
            url : `https://api.maptiler.com/geocoding/${placeId}.json?key=0aOLlFlJbVuFtN4GnoS4`
        }
        axios(options).then((res) => {
            console.log(res.data.features)
            let filtered_feature = res.data.features[0]
            const markerpos = {
                lat : filtered_feature.center[1],
                lng : filtered_feature.center[0]
            }
            setmarker(markerpos)
            setfeature(res.data.features[0])
            getfeature(markerpos,filtered_feature)
        })
    }
    return (
        <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: "600",
        }}
      >
        <input
          type="search"
          placeholder="Search the area of the property"
          style={{
            width: "22vw",
            borderRadius: "25px",
            border: "none",
            padding: "10px 20px",
          }}
          onChange={(e) => handleSearch(e)}
          value={searchvalue}
        />
                <ul
          className={listStyle.searchresults}
          // onMouseLeave={() => setholdsearchvalue("")}
        >
          {searchresult.map((place,index) => {
            if (place.place_name) {
              return (
                <li key={index} onClick={(e) => handelNavigate(place)}>
                  {place.place_name + ","+place.place_type[0] }
                </li>
              );
            }
          })}
        </ul>
      </div>
    )
}