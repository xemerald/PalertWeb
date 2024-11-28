export enum MapStylesName {
	NormalStyle,
	ShakeStyle
};
export const MapStyles: {[key: string]: any} = {
	NormalStyle: {
		google: [{
				"elementType": "geometry",
				"stylers": [
					{ "visibility": "simplified" }
				]
			},{
				"featureType": "administrative",
				"elementType": "geometry.stroke",
				"stylers": [
					{ "visibility": "on" }
				]
			}
		],
		leaflet: {
			url: 'https://wmts.nlsc.gov.tw/wmts/EMAP6/default/GoogleMapsCompatible/{z}/{y}/{x}.png',
			options: {
				attribution: '&copy; <a href="https://maps.nlsc.gov.tw/" target="_blank" rel="noopener noreferrer">National Land Surveying and Mapping Center, MOI, R.O.C</a>',
				maxZoom: 18
			}
		}
	},
	ShakeStyle: {
		google: [{
				"stylers": [
					{ "visibility": "off" }
				]
			},{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
					{ "visibility": "simplified" }
				]
			},{
				"featureType": "administrative",
				"stylers": [
					{ "visibility": "on" }
				]
			},{
				"featureType": "landscape",
				"elementType": "geometry",
				"stylers": [
					{ "visibility": "simplified" },
					{ "color": "#e4e2dd" }
				]
			}
		],
		leaflet: {
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
			options: {
				attribution: 'Tiles &copy; Esri, DeLorme, NAVTEQ, TomTom, Intermap, and others contributors',
				maxZoom: 18
			}
		}
	}
};
