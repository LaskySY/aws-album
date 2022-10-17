import React, { useState } from 'react'
import '../css/uploader.css'
import axios from 'axios'

const Uploader = () => {
    const [file, updateFile] = useState(null)
    function fileDragHover(e) {
        var fileDrag = document.getElementById('file-drag');
        e.stopPropagation();
        e.preventDefault();
        fileDrag.classNameName = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
    }
    function fileSelectHandler(e) {
        var files = e.target.files || e.dataTransfer.files;
        fileDragHover(e);
        updateFile(files[0])
    }

    function uploadFile(e) {
        if (file instanceof Blob === false)
            return
        const reader = new FileReader();

        reader.onload = () => {
            var tagsInput = document.getElementById('tags-upload')
            var url = process.env.REACT_APP_BASE_API + '/upload'
            var data = reader.result.split(',')[1]
            var config = {
                headers: {
                    'x-amz-meta-customLabels': tagsInput.value,
                    'Content-Type': 'image/jpg;base64',
                },
                params: {
                    'key': new Date().getTime() + file.name.split(".")[1],
                }
            }
            axios.put(url, data, config)
                .then(data => {
                    updateFile(null)
                    tagsInput.value = ''
                    document.getElementById('upload-response').innerHTML = "Upload Success"
                })
                .catch(error => {
                    console.log(error)
                    document.getElementById('upload-response').innerHTML = "Upload Error"
                })
        }
        reader.readAsDataURL(file);
    }

    return (
        <form id="file-upload-form" className="uploader">
            <input id="file-upload" type="file" name="fileUpload" accept=".png,.jpg,.jpeg"
                onChange={fileSelectHandler} />
            <label htmlFor="file-upload" id="file-drag" onDrop={fileSelectHandler}
                onDragOver={fileDragHover} onDragLeave={fileDragHover} >
                {
                    file instanceof Blob
                        ? <div>
                            <img id="file-image" src={URL.createObjectURL(file)} alt="Preview" />
                            <div id="response">
                                <div id="messages">
                                    <strong>{encodeURI(file.name)}</strong>
                                </div>
                            </div>
                        </div>
                        : <div id="start">
                            <i className="fa fa-download" aria-hidden="true"></i>
                            <div>Select a file or drag here</div>
                        </div>
                }
            </label>
            <span>Tags: </span>
            <input id="tags-upload" className="tag-input hidden" placeholder="split with comma" />
            <span id="submit-button" className="btn btn-primary" onClick={uploadFile}>Submit</span>
            <span id="upload-response"></span>
        </form>
    )
}

export default Uploader