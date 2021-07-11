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
import { Viewer } from "photo-sphere-viewer";
import MarkersPlugin from "photo-sphere-viewer/dist/plugins/markers";
import "photo-sphere-viewer/dist/plugins/markers.css";
import { getImageResolution } from "utils";
import PanoramaView from "./components/PanoramaView";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

var newHotSpot = null;
var isSelectNewHotspotPosition = false;
var imagesGlobal = [];
const CreateTour = (props) => {
  const { images } = useGetTour();
  const { updateImages } = useSetTour();
  const [isOpenUploadModal, setOpenUploadModal] = useState(false);
  const [filesSelected, setFilesSelected] = useState([]);
  const [currentImageSelected, setCurrentImageSelected] = useState(null);
  const [isAddHotspot, setIsAddHotspot] = useState(false);
  const [hotspotSuorce, setHotspotSuorce] = useState(null);
  const viewer = useRef();
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

  const handleSaveHotspot = () => {
    if (!hotspotSuorce) {
      alert("Bạn cần chọn ảnh cho hotspot trước khi lưu");
      return;
    }
    const newImageSelected = { ...currentImageSelected };
    const newHotspotObject = {
      ...newHotSpot,
      id: "hotspot" + new Date().getTime(),
      image: "https://photo-sphere-viewer.js.org/assets/pin-red.png",
      data: {
        imageId: hotspotSuorce.id,
      },
    };
    const newImages = images.map((x) => {
      if (x.id === currentImageSelected.id) {
        newImageSelected.hotspots = [...x.hotspots, newHotspotObject];
        return {
          ...x,
          hotspots: [...x.hotspots, newHotspotObject],
        };
      }
      return x;
    });
    newHotSpot = null;
    setCurrentImageSelected(newImageSelected);
    isSelectNewHotspotPosition = false;
    updateImages(newImages);
    setIsAddHotspot(false);
    setHotspotSuorce(null);
  };

  const handleAddHotsport = () => {
    isSelectNewHotspotPosition = true;
    setIsAddHotspot(true);
  };

  const renderPanoramaView = () => {
    if (viewer.current) {
      viewer.current.destroy();
      viewer.current = null;
    }
    const viewObject = new Viewer({
      container: document.getElementById("panorama-container"),
      panorama: currentImageSelected.src,
      plugins: [
        [
          MarkersPlugin,
          {
            markers: currentImageSelected.hotspots,
          },
        ],
      ],
    });
    viewObject.on("click", function (e, data) {
      if (!data.rightclick && isSelectNewHotspotPosition) {
        const markerId = "new-marker";
        try {
          if (newHotSpot) markersPlugin.removeMarker(markerId);
        } catch (e) {}
        const newMarker = {
          id: markerId,
          longitude: data.longitude,
          latitude: data.latitude,
          image: "https://photo-sphere-viewer.js.org/assets/pin-blue.png",
          width: 32,
          height: 32,
          anchor: "bottom center",
          data: {
            generated: true,
          },
        };
        newHotSpot = newMarker;
        markersPlugin.addMarker(newMarker);
      }
    });
    const markersPlugin = viewObject.getPlugin(MarkersPlugin);
    markersPlugin.on("select-marker", (e, marker, data) => {
      if (marker.data && !isSelectNewHotspotPosition) {
        const newImageSelected = imagesGlobal.find(
          (x) => x.id === marker.data.imageId
        );
        setCurrentImageSelected(newImageSelected);
      }
    });
    viewer.current = viewObject;
  };

  const handleChangeHotSpotSource = (event, newValue) => {
    setHotspotSuorce(newValue);
  };

  const cancelAddHotspot = () => {
    const markersPlugin = viewer.current.getPlugin(MarkersPlugin);
    markersPlugin.setMarkers(currentImageSelected.hotspots);
    viewer.current.setPanorama(currentImageSelected.src);
    newHotSpot = null;
    isSelectNewHotspotPosition = false;
    setIsAddHotspot(false);
    setHotspotSuorce(null);
  };

  useEffect(() => {
    if (currentImageSelected) {
      if (viewer.current) {
        const markersPlugin = viewer.current.getPlugin(MarkersPlugin);
        markersPlugin.setMarkers(currentImageSelected.hotspots);
        viewer.current.setPanorama(currentImageSelected.src);
      } else {
        renderPanoramaView();
      }
    }
  }, [currentImageSelected]);

  useEffect(() => {
    imagesGlobal = images;
  }, [images]);
  return (
    <Container maxWidth="xl" className="text-left mt-5">
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <div className={styles.panoramaContainer}>
            <PanoramaView />
          </div>
          <div className="mt-3">
            {images.map((x) => (
              <ImagePreview
                image={x}
                key={`preview-image-id-${x.id}`}
                isActive={
                  currentImageSelected && x.id === currentImageSelected.id
                }
                onClick={() => setCurrentImageSelected(x)}
              />
            ))}
          </div>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            onClick={openUploadModal}
            className="mb-3"
          >
            Tải ảnh lên
          </Button>
          <IF condition={!isAddHotspot && currentImageSelected}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddHotsport}
            >
              Thêm hotspot
            </Button>
          </IF>
          <IF condition={isAddHotspot}>
            <br />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveHotspot}
              className="mb-3"
            >
              Lưu hotspot
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={cancelAddHotspot}
            >
              Hủy tạo hotspot
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
              <Autocomplete
                id="combo-box-demo"
                options={images.filter((x) => x.id !== currentImageSelected.id)}
                value={hotspotSuorce}
                onChange={handleChangeHotSpotSource}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                classes={{ root: styles.hotspotSuorce }}
                renderInput={(params) => (
                  <TextField {...params} label="Combo box" variant="outlined" />
                )}
              />
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
    </Container>
  );
};

export default CreateTour;
