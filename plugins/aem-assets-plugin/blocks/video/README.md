# Video Block

The Video Block module provides functionality to decorate video blocks on a webpage. It supports different types of video blocks such as hero videos, inline video cards, and modal videos. This module includes utilities to load and configure video.js, handle device-specific video URLs, and create custom play buttons. 

Use videos as hero banner without affecting LHS. This block use poster image and delayed script loading to make rendering faster . 

# How to Use 

We also need to add the below line of code to delayed.js. 

```document.dispatchEvent(new Event('delayed-phase'));```

```Window.DELAYED_PHASE = true;``` 

like this [delayed.js](https://github.com/hlxsites/franklin-assets-selector/blob/03a36748eb9f22869a2778ee93b10d63a19cd793/scripts/delayed.js#L1-L2)
