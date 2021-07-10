import { Container, Grid } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
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
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

const CreateTour = (props) => {
  const { images } = useGetTour();
  const { updateImages } = useSetTour();
  const [isOpenUploadModal, setOpenUploadModal] = useState(false);
  const [filesSelected, setFilesSelected] = useState([]);
  const [currentImageSelected, setCurrentImageSelected] = useState(null);

  const panoramaContainer = useRef();

  const closeUploadModal = () => {
    setOpenUploadModal(false);
  };

  const openUploadModal = () => {
    setFilesSelected([]);
    setOpenUploadModal(true);
  };
  const onSaveFile = () => {
    if (filesSelected.length > 0) {
      const newImages = filesSelected.map((x) => ({
        file: { ...x },
        id: new Date().getTime(),
        src: URL.createObjectURL(x),
      }));
      updateImages([...images, ...newImages]);
      if (!currentImageSelected) {
        setCurrentImageSelected(newImages[0]);
      }
    }
    closeUploadModal();
  };

  useEffect(() => {
    if (currentImageSelected) {
      panoramaContainer.current.setAttribute("src", currentImageSelected.src);
    }
  }, [currentImageSelected]);
  return (
    <Container maxWidth="xl" className="text-left">
      <Grid container>
        <Grid item xs={10}>
          <div className={styles.panoramaContainer}>
            <img ref={panoramaContainer} class="w-100 h-100"/>
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
          <Button variant="contained" color="primary">
            Xem Preview
          </Button>
          <Button variant="contained" color="secondary">
            Thêm hotspot
          </Button>
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
          <DropzoneArea onChange={(files) => setFilesSelected(files || [])} />
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
