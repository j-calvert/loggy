import { Gallery } from './image-list.js';

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('sw.js', {
        scope: '/',
      });
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

const imgSection = document.querySelector('section');

const getImageBlob = async (url) => {
  const imageResponse = await fetch(url);
  if (!imageResponse.ok) {
    throw new Error(
      `Image didn't load successfully; error code: ${
        imageResponse.statusText || imageResponse.status
      }`
    );
  }
  return imageResponse.blob();
};

const createGalleryFigure = async (galleryImage) => {
  try {
    const imageBlob = await getImageBlob(galleryImage.url);
    const myImage = document.createElement('img');
    const myCaption = document.createElement('caption');
    const myFigure = document.createElement('figure');
    myCaption.innerHTML = `${galleryImage.name}: Taken by ${galleryImage.credit}`;
    myImage.src = window.URL.createObjectURL(imageBlob);
    myImage.setAttribute('alt', galleryImage.alt);
    myFigure.append(myImage, myCaption);
    imgSection.append(myFigure);
  } catch (error) {
    console.error(error);
  }
};

function successCallback(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const altitude = position.coords.altitude;
  const myP = document.createElement('p');
  myP.innerHTML = `latitude: ${latitude}`;
  imgSection.append(myP);
  // use the location data here
}

function errorCallback(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      // user denied the request for geolocation
      break;
    case error.POSITION_UNAVAILABLE:
      // location information is unavailable
      break;
    case error.TIMEOUT:
      // the request to get user location timed out
      break;
    case error.UNKNOWN_ERROR:
      // an unknown error occurred
      break;
  }
}

registerServiceWorker();
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
} else {
  // browser does not support geolocation
}

// Gallery.images.map(createGalleryFigure);
