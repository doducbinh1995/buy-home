//@ts-check
import { Container, Grid } from "@material-ui/core";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { useGetTour, useSetTour } from "./../../redux/tour.reducer";
import { DropzoneArea } from "material-ui-dropzone";
import styles from "./styles.module.scss";
import ImagePreview from "./components/ImagePreview";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import IF from "../../components/IF";
import AddHotSpot from "./components/AddHotSpot";

import { getImageResolution } from "utils";
import Preview from "./components/Preview";

const CreateTour = (props) => {
  const { images } = useGetTour();
  const { updateImages } = useSetTour();
  const [isOpenUploadModal, setOpenUploadModal] = useState(false);
  const [isPreview, setPreview] = useState(false);
  const [filesSelected, setFilesSelected] = useState([]);
  const [currentImageSelected, setCurrentImageSelected] = useState(null);
  const [isAddHotspot, setIsAddHotspot] = useState(false);
  const hotspotPosition = useRef();
  const markersContainer=useRef();
  const panoramaContainer = useRef();

  const closeUploadModal = () => {
    setOpenUploadModal(false);
  };

  const openUploadModal = () => {
    setFilesSelected([]);
    setOpenUploadModal(true);
  };
  const onSaveFile = async () => {
    if (filesSelected.length > 0) {
      const newImages = [];
      for (let fileIndex = 0; filesSelected[fileIndex]; fileIndex++) {
        const file = filesSelected[fileIndex];
        const fileInfo = {
          name: file.name,
        };
        const imageSrc = URL.createObjectURL(file);
        const { width, height } = await getImageResolution(imageSrc);
        newImages.push({
          file: fileInfo,
          id: new Date().getTime(),
          src: imageSrc,
          width,
          height,
          name: file.name,
          hotspots: [],
        });
      }
      updateImages([...images, ...newImages]);
      if (!currentImageSelected) {
        setCurrentImageSelected(newImages[0]);
      }
    }
    closeUploadModal();
  };

  const onChangeHotspotPosition = (e) => {
    const widthRatio = currentImageSelected.width / e.containerWidth;
    const heightRatio = currentImageSelected.height / e.containerHeight;
    hotspotPosition.current = {
      x: widthRatio * e.offsetLeft,
      y: heightRatio * e.offsetTop,
    };
  };

  const handleSaveHotspot = () => {
    const newImageSelected = { ...currentImageSelected };
    const newHotspot = {
      ...hotspotPosition.current,
      id: "hotspot" + new Date().getTime(),
      image: "https://photo-sphere-viewer.js.org/assets/pin-blue.png",
      width: 32,
      height: 32,
      anchor: "bottom center",
      tooltip: "Next section",
    };
    const newImages = images.map((x) => {
      if (x.id === currentImageSelected.id) {
        newImageSelected.hotspots = [...x.hotspots, newHotspot];
        return {
          ...x,
          hotspots: [...x.hotspots, newHotspot],
        };
      }
      return x;
    });
    setCurrentImageSelected(newImageSelected);
    updateImages(newImages);
    setIsAddHotspot(false);
  };

  useEffect(() => {
    if (currentImageSelected) {
      panoramaContainer.current.setAttribute("src", currentImageSelected.src);
      currentImageSelected.hotspots.map(hotspot=>{
        
      })
    }
  }, [currentImageSelected]);
  return (
    <Container maxWidth="xl" className="text-left">
      <Grid container>
        <Grid item xs={10}>
          <div className={styles.panoramaContainer}>
            <div className="w-100 position-relative">
            <img ref={panoramaContainer} className="w-100" />
            <div className="w-100 h-100 position-absolute" style={{top:0}} ref={markersContainer}></div>
            </div>
            <IF condition={isAddHotspot}>
              <AddHotSpot onChangePosition={onChangeHotspotPosition} />
            </IF>
          </div>
          <div className="text-center">
            {images.map((x) => (
              <ImagePreview image={x} key={`preview-image-id-${x.id}`} />
            ))}
          </div>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={openUploadModal}>
            Tải ảnh lên
          </Button>
          <IF condition={currentImageSelected}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPreview(true)}
            >
              Xem Preview
            </Button>
          </IF>
          <IF condition={!isAddHotspot && currentImageSelected}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setIsAddHotspot(true)}
            >
              Thêm hotspot
            </Button>
          </IF>
          <IF condition={isAddHotspot}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveHotspot}
            >
              Lưu hotspot
            </Button>
          </IF>
          <hr />
          {currentImageSelected && (
            <Fragment>
              <h4>Thông tin ảnh</h4>
              <p>Tên file: {currentImageSelected.name}</p>
              <p>
                Độ phân giải:{" "}
                {`${currentImageSelected.width}px x ${currentImageSelected.height}px`}
              </p>
            </Fragment>
          )}
          {isAddHotspot && (
            <Fragment>
              <h4>Chọn nguồn ảnh cho hotspot</h4>
            </Fragment>
          )}
        </Grid>
      </Grid>
      <Dialog
        open={isOpenUploadModal}
        onClose={closeUploadModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DropzoneArea
            onChange={(files) => setFilesSelected(files || [])}
            maxFileSize={10 * 1024 * 1024 * 1024}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUploadModal} color="primary">
            Cancel
          </Button>
          <Button onClick={onSaveFile} color="primary" autoFocus>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      {isPreview && (
        <Preview
          image={currentImageSelected}
          handleClose={() => setPreview(false)}
        />
      )}
    </Container>
  );
};

export default CreateTour;
