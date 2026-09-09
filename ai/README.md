# AI Subsystems

This directory holds offline machine learning artifacts, training pipelines, and experimental notebooks for MELA.

## Structure
- `image_models/`: Vision model weights and ONNX/PyTorch artifacts for artisan craft image enhancement, background cleanup, and edge detection.
- `pricing_model/`: ML pricing models incorporating raw material costs, crafting hours, artisan skill rating, and market demand indices.
- `datasets/`: Curated datasets of Indian handicraft metadata, craft categories, raw material benchmarks, and artisan pricing references.
- `experiments/`: Jupyter notebooks and experimentation logs for training and evaluation.

> **Rule**: Production inference pipelines are integrated into `backend/mela_api/app/ai/`. Large binaries (>50MB) must not be checked into Git and should be fetched from cloud artifact storage.
