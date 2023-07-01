const API_KEY = "AIzaSyC6Eq7Dtzgo4cGOXdsodsFgBASVo2dBrks";
const BASE_URL= "https://www.googleapis.com/youtube/v3";

const container = document.getElementById("videos-container");

// first we construct the url
// then we send the request
// then we convert it to json(format we want)
// get the data and modify it according to our needs
async function getVideos(q) {
  const url = `${BASE_URL}/search?key=${API_KEY}&q=${q}&type=videos&maxResults=20`;
  const response = await fetch(url, {
    method: "get",
  });
  const data = await response.json();

  const videos = data.items;
  getVideoData(videos);
}

async function getVideoData(videos) {
  let videoData = [];
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const videoId = video.id.videoId;
    videoData.push(await getVideoDetails(videoId));
  }

  console.log(videoData);
  renderVideos(videoData);
}

async function getVideoDetails(videoId) {
  const url = `${BASE_URL}/videos?key=${API_KEY}&part=snippet,contentDetails,statistics&id=${videoId}`;
  const response = await fetch(url, {
    method: "get",
  });
  const data = await response.json();
  return data.items[0];
}

function renderVideos(videos) {
  container.innerHTML=``;
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const thumbnailUrl = video.snippet.thumbnails.high.url;
    container.innerHTML +=`
  <div class="video" onclick="openVideoDetails('${video.id}')">
  <img src="${thumbnailUrl}" class="thumbnail" alt="">
  <div class="content">
      <img src="" class="channel-icon" alt="">
      <div class="info">
          <h4 class="title">${video.snippet.localized.title}</h4>
          <p class="channel-name"></p>
      </div>
  </div>
</div>
`;
}
}

function openVideoDetails(videoId) {
  localStorage.setItem("videoId", videoId);
  window.open("/videoDetails.html");
}

getVideos("");