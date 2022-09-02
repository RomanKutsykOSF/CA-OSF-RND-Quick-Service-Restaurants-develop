import { GlobalContext } from "context/global";
import { Store } from "interfaces/storelocatorContext";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

const Map = ({ pins, markerClicked }: { pins: Store[]; markerClicked: (pin: Store) => void }): JSX.Element => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [Map, setMap] = useState<google.maps.Map>(null);
    const globalContext = useContext(GlobalContext);

    const generateMapPins = useCallback((): void => {
        const svgMarker = {
            path:
                "M12 2C9.87827 2 7.84344 2.84285 6.34315 4.34315C4.84285 5.84344 4 7.87827 4 10C4 13.0981 6.01574 16.1042 8.22595 18.4373C9.31061 19.5822 10.3987 20.5195 11.2167 21.1708C11.5211 21.4133 11.787 21.6152 12 21.7726C12.213 21.6152 12.4789 21.4133 12.7833 21.1708C13.6013 20.5195 14.6894 19.5822 15.774 18.4373C17.9843 16.1042 20 13.0981 20 10C20 7.87827 19.1571 5.84344 17.6569 4.34315C16.1566 2.84285 14.1217 2 12 2ZM12 23C11.4453 23.8321 11.445 23.8319 11.4448 23.8317L11.4419 23.8298L11.4352 23.8253L11.4123 23.8098C11.3928 23.7966 11.3651 23.7776 11.3296 23.753C11.2585 23.7038 11.1565 23.6321 11.0278 23.5392C10.7705 23.3534 10.4064 23.0822 9.97082 22.7354C9.10133 22.043 7.93939 21.0428 6.77405 19.8127C4.48426 17.3958 2 13.9019 2 10C2 7.34784 3.05357 4.8043 4.92893 2.92893C6.8043 1.05357 9.34784 0 12 0C14.6522 0 17.1957 1.05357 19.0711 2.92893C20.9464 4.8043 22 7.34784 22 10C22 13.9019 19.5157 17.3958 17.226 19.8127C16.0606 21.0428 14.8987 22.043 14.0292 22.7354C13.5936 23.0822 13.2295 23.3534 12.9722 23.5392C12.8435 23.6321 12.7415 23.7038 12.6704 23.753C12.6349 23.7776 12.6072 23.7966 12.5877 23.8098L12.5648 23.8253L12.5581 23.8298L12.556 23.8312C12.5557 23.8314 12.5547 23.8321 12 23ZM12 23L12.5547 23.8321C12.2188 24.056 11.7807 24.0556 11.4448 23.8317L12 23Z M12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8ZM8 10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10Z",
            fillColor: "#05AD6D",
            fillOpacity: 0.6,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30),
        };

        const bounds = new google.maps.LatLngBounds();

        if (pins) {
            pins.forEach((pin) => {
                const position = new google.maps.LatLng({ lat: +pin.latitude, lng: +pin.longitude });
                const marker = new google.maps.Marker({
                    position,
                    icon: svgMarker,
                    map: Map,
                    clickable: true,
                });

                marker.addListener("click", () => {
                    markerClicked(pin);
                });

                bounds.extend(marker.getPosition());
            });
        }

        Map.fitBounds(bounds);

        if (pins.length <= 2) {
            Map.setZoom(18);
        }
    }, [pins, Map, markerClicked]);

    useEffect(() => {
        if (!Map) {
            if (mapRef.current) {
                setMap(
                    new window.google.maps.Map(mapRef.current, {
                        zoom: 4,
                    })
                );
            }
        }
        if (Map) generateMapPins();
    }, [Map, generateMapPins]);

    return (
        <>
            <div className="map" ref={mapRef}></div>
            <style jsx>{`
                .map {
                    height: 285px;
                }

                @media only screen and (min-width: ${globalContext.viewports.large}px) {
                    .map {
                        height: calc(100vh - 64px);
                    }
                }
            `}</style>
        </>
    );
};

export default Map;
