import React, { useRef } from 'react';
import Cropper from 'react-cropper';
import 'react-cropper/node_modules/cropperjs/dist/cropper.css';

interface IProps {
   setImage: (image: Blob) => void;
   imagePreview: string;
}

const PhotoWidgetCropper: React.FC<IProps> = ({ setImage, imagePreview }) => {

   const cropper = useRef<Cropper>(null);

   const cropImage = () => {
      if (cropper.current && typeof cropper.current.getCroppedCanvas() === 'undefined') {
         return;
      }

      cropper && cropper.current && cropper.current.getCroppedCanvas().toBlob((blob: any) => {
         setImage(blob)
      }, 'image/jpeg');
   }

   return (
      <div>
         <Cropper
            ref={cropper}
            src={imagePreview}
            style={{ height: 200, width: '100%' }}
            // Cropper.js options
            aspectRatio={1 / 1}
            preview='.img-preview'
            guides={false}
            viewMode={1}
            dragMode="move"
            scalable={true}
            cropBoxMovable={true}
            cropBoxResizable={true}
            crop={cropImage}
         />
      </div>
   )
}

export default PhotoWidgetCropper
