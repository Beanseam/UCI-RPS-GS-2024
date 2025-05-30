﻿# University of California, Irvine - Rocket Project Solids Repository 
 
[Website](https://www.rocket.eng.uci.edu/solids/)

## Tech Stack
<div align="left">
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" height="40" alt="python logo"  />
</div>  

## File Structure
```txt
UCI-RPS-GS-2024/  
├─GS/ # Ground station code  
├─RF/ # RF transmission code for sending signal from GS to rocket  
└─SRAD/ # Flight code  
```
## Running Ground Station

### Clone Repository
```bash
git clone https://github.com/Beanseam/UCI-RPS-GS-2024.git
```
### Install Dependencies
```bash
pip install -r requirements.txt
npm install
```
### Run Frontend and Backend 
```bash
npm start
python flask_app.py
```
