import { useState, useEffect, useRef } from 'react';
import SelectionBox from './SelectionBox';

const CropImage = (props) => {
    const [mouseDown, setMouseDown] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const [scale, setScale] = useState(1);
    const imgRef = useRef(null);
    const cropBackgroundRef = useRef(null)

    useEffect(() => {
        cropBackgroundRef.current.scrollIntoView()
        
        if (props.image.width > imgRef.current.width) {
            setScale(props.image.width / imgRef.current.width);
        } 

        setX(0);
        setY(0);
    //eslint-disable-next-line
    }, [props.image])

    const placeBox = (e, xPos = null, yPos = null) => {
        if (e)
            e.stopPropagation();

        if (props.image.width > imgRef.current.width) {
            var scale = props.image.width / imgRef.current.width;
        } else {
            scale = 1;
        }
        setScale(scale)
        
        const maxWidth = imgRef.current.offsetWidth - props.canvasWidth / scale;
        const maxHeight = imgRef.current.offsetHeight - props.canvasHeight / scale;
        if (xPos === null)
            xPos = e.nativeEvent.offsetX - props.canvasWidth / scale / 2;

        if (yPos === null)
            yPos = e.nativeEvent.offsetY - props.canvasHeight / scale / 2;


        if (xPos > maxWidth) {
            //offset from middle in ImageCanvas
            var extraX = xPos - maxWidth; 
            xPos = maxWidth
        } else if (xPos < 0) {
            extraX = xPos;
            xPos = 0;
        } else {
            extraX = 0;
        }

        if (yPos > maxHeight) {
            //offset from middle in ImageCanvas
            var extraY = yPos - maxHeight;
            yPos = maxHeight
        } else if (yPos < 0) {
            extraY = yPos;
            yPos = 0;
        } else {
            extraY = 0;
        }


        setX(xPos);
        props.setCanvasStartX(xPos * scale);
        props.setExtraX(extraX * scale);
        
        setY(yPos);
        props.setCanvasStartY(yPos * scale);
        props.setExtraY(extraY * scale);
    }

 
    return (
        <div ref = {cropBackgroundRef} className="mx-auto py-8 w-full bg-stone-600 px-4">
            <div className="relative mx-auto cursor-crosshair w-fit h-fit lg:max-w-1/2 touch-none border border-black"
                draggable={false}
                onPointerMove={(e) => { if (mouseDown) placeBox(e); }}
                onPointerDown={(e) => { placeBox(e); setMouseDown(true) }}
                onPointerUp={() => { setMouseDown(false) }}>
                
                <img alt = {"Uploaded Image"} ref = {imgRef} src={props.imageURL} draggable = {false}/>

                <SelectionBox x={x} y={y} width = {props.canvasWidth / scale} height={props.canvasHeight / scale} />
            </div>
            <p className = "text-white">Click or drag to crop out part of your image. Then, fine tune your selection below</p>
        </div>

    )
}

export default CropImage;