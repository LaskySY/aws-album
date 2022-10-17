import { useSelector } from "react-redux/es/exports";
import React from "react";
import PhotoAlbum from "react-photo-album";


const Gallery = () => {
    const images = useSelector(state => state.images.data)
    const uniqueImages = [...new Map(images.map(item =>
        [item['url'], item])).values()];
    const photos = uniqueImages.map(image => ({
        src: image.url,
        width: image.width,
        height: image.height,
        labels: image.labels
    }))
    function renderPhoto(props) {
        const { photo, imageProps } = props
        return (
            <div className="container" width={photo.width} height={photo.height}>
                <img className="gallery-image" alt='' {...imageProps} />
                <div className="middle">
                    <div className="text">{photo.labels.join(' ')}</div>
                </div>
            </div>
        )
    }
    return (
        <div>
            <p>{images.length === 0 ? "No search Result" : null}</p>
            <PhotoAlbum
                layout="masonry"
                photos={photos}
                padding={3}
                renderPhoto={renderPhoto}
            />
        </div>

    )
}

export default Gallery