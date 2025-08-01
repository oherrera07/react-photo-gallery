import React, { useEffect, useState } from 'react'
//import images from './api-mock.json';
import './App.css';
import { getImages, searchImages } from './api';

const App = () => {
  //const [imageList, setImageList] = useState(images.resources); //se usaba con el api-mock.json
  const [imageList, setImageList] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const responseJson = await getImages()
      setImageList(responseJson.resources);
      setNextCursor(responseJson.next_cursor);
    }
    fetchData();
  }, []);

  const handleLoadMoreButtonClick = async () => {
    const responseJson = await getImages(nextCursor);
    setImageList((currentImageList) => [
      ...currentImageList,
      ...responseJson.resources,
    ]); //adds next 10 images to the current list of images
    setNextCursor(responseJson.next_cursor);
  }

  const handleFormSubmit = async (event) => {

    event.preventDefault();
    const responseJson = await searchImages(searchValue, nextCursor);
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);

  }

  const resetForm = async () => {
    const responseJson = await getImages();
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);
    setSearchValue('');
  }

  return (
    <>
      <header>
        <nav>
          <ul>
            <a href='/'>
              <div className="left">
                <h3 className="margin-remove titillium-web-semibold">Daysi Armendariz</h3>
                <span className="margin-right"></span>
                <h6 className="titillium-web-extralight">Photography</h6>
              </div>
            </a>
          </ul>
        </nav>
      </header>
      <form onSubmit={handleFormSubmit}>
        <input
          className='titillium-web-light'
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          required='required'
          placeholder='Enter a Search Value...'></input>
        <button type='submit' className='titillium-web-light'>Search</button>
        <button
          className='titillium-web-light'
          onClick={resetForm}
          type='button'>Clear</button>
      </form>
      <div className='image-grid'>
        {imageList.map((image) => (
          <div key={image.asset_id} className="image-item">
            <img src={image.url} alt={image.public_id} onClick={() => setImagenSeleccionada(image.url)} />
            <p className='titillium-web-light'>{image.display_name}</p>
          </div>
        ))}
      </div>

      {imagenSeleccionada && (
        <div className='main-container'>
          {/* Contenedor de imagen + botón cerrar */}
          <div className='image-container'>
            {/* Botón cerrar */}
            <div className='close-button'
              onClick={() => setImagenSeleccionada(null)}
            >
              ×
            </div>

            {/* Imagen grande */}
            <img
              src={imagenSeleccionada}
              alt="Vista grande"
              style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '8px' }}
            />
          </div>
        </div>
      )}

      <div className='footer'>
        {nextCursor && <button onClick={handleLoadMoreButtonClick}>Load More</button>}
      </div>
    </>
  )
}

export default App
