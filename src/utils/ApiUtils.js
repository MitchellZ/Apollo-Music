class ApiUtils {

    // Fetch playlist from API
    static fetchSongs = async (user_request, setLoading, setError, setAPIResponse) => {
        // Fetch playlist from API
        console.debug('Fetching playlist for:', user_request);
        setLoading(true);
        setError(false);
    
        try {
          const uniqueParam = `nocache=${Date.now()}`; // Using a timestamp as a unique parameter
    
          // const proxyUrl = '';
          const apiUrl = `/query?message=${user_request}&${uniqueParam}`;
    
          const response = await fetch(apiUrl);
    
          let data = await response.json();
          // data = JSON.parse(data.contents)
          if (data.response && data.response.length > 0) {
            setAPIResponse(data);
          }
    
          // Check status code
          if (!response.ok) {
            setError(true);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError(true);
        }
        setLoading(false);
      };

      // Get song link for streaming from URL
      static getSongLink(url) {
        // Check if the URL contains a video ID
        if (!url)
          return '/audio/Dance_The_Night.mp3';
        if (!url.includes('v='))
          return '/audio/Dance_The_Night.mp3';
        const videoId = url.split('v=')[1];
        return 'https://vid.puffyan.us/latest_version?id=' + videoId + '&itag=140';
      }

}

export default ApiUtils;