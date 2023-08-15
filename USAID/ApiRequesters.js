async function sendRequest(url, method = 'GET', data = null) {
    try {
      const options = {
        method: method,
     
        body: data ? JSON.stringify(data) : null,
      };
  
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  



  

//   

async function main(){

const encodedQ = 'cHVyY2hhc2luZyBwb3dlciB6YW1iaWEgMjAyMA%3D%3D'

const ApiUrl = 'https://dec.usaid.gov/api/qsearch.ashx?q=' + encodedQ +'&rtype=JSON';

const scndApi = 'https://data.usaid.gov/resource/sf8i-fzzw.json'




const response = await fetch('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGEAAABBCAYAAADBqsqVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMjgwMTE3NDA3MjA2ODExODA4MzlBNjE2QjE0MTQ2MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1MTE4RDg1RDQyNTExMUUyODZBNUQwQ0E0QUVGQ0NGRSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1MTE4RDg1QzQyNTExMUUyODZBNUQwQ0E0QUVGQ0NGRSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0U5RTFDNDVERDIxNjgxMThDMTQ4QTExM0NFODYxNzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDI4MDExNzQwNzIwNjgxMTgwODM5QTYxNkIxNDE0NjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4CJAnRAAAFhElEQVR42uxcW4gbVRj+z2Qmycxskk1bl3apFFT0QWQrVdyFXqgXfBD0VR98WdAHEQTxzdd6QxFEVFDwRRCfBRWlVcEqiBWUgmBRUVvXsnaTzSaby56ZOf5nMlmT2YRONpnMSf0/ODszZy6b/N9/m/+cHCaEAEKy0EgEyUOXfxhj/iboY12tu58wOkTXttPaJHQJXQtaqmufERFjI0A2L2huZ18PuSYpfOPDvTf9VhRMJ7nFgzITzoNrv9yAuzxsCZIEA1tWEmALKJK44gIrSzl3LKSbBGkFaWwmuZ/4WQjk7LslLWQJkpSsAEEkxBocfPlmA3lrWigmyM60IEuIO0KzwOv0kMBCcYEQP4xO9qmF/JSflpIlTMQStH4kEKhsQSQQiAQiYeqROeQSCYm+euI3uP7Z+lSnGFNPgn27A+bNLtiHHSIhKczeu9WzJRIm7YrwnbNw3K8GQ+EE94+JhAkjt8RBs9uDVXKbW+REQlKuaNAxkRAzUqj5+cXeYJxfcvx+ImFCyB/DGJDuFbg8lv1EwqRc0T1bQ/UTCWOGXhQwc6T/e4Hsl+eJhJhROLk1+JNrwflpUqok/7l80zXmvKHv2/PA1lXP89Xh9Uve07iQ+n+R0PpLgz0Pta4q1GGRvdGFQ6c2h7qn9FEa/n7TVMcStufnxQx3k8Glly1Y/zINB5+p78oqRoXU/kuvWFD7bnL6KFQioYMqCuDCcg4OPNmA4v2T8+flT1H73zDBrU12SD0iCQImnV846D0uvmSiVegw/3QTjH3xWQW/osHKq1mofmsMEEvcJIgIJIj21LAkUEHB1JaRCLSKQgxliMqZNKy8bvquMCmEfxIy2B0lmGo76B7+fNGC/FcGzD9VH0ve75QZrLxmwcbXyZdaw/MblYgJA7UWBVY9n4f5Jxoj5f4VDPwr6Pu9DTWmU0WKCR5e5oEa8DYArcKEg7qAwtHh60Ib3xhw8QUzEd8/8DtFigkAypAgIX8pYd7qgLeLDyXvk3PPhUKjnxEtQS0ScgsctJzYFQnMFmAd5lA9p86wmzdt7khi5gQH19u9K5k5zqFyTleIhAjuSH5fVeqQcozAvovvygo6kPdDJguipUZg9kQkSwBwFWGhcCcHYQi0hP7nN7834J8PMnDdwy2wjwwI3Hi/fQdaw9m0GiSwSCSo447so/2twK0zWH03C+tftH395ikTZk/qMLfchJS1U4PsYxzKZ40pckeKBOYUBmNrYWdWVPtBh8tvZYGXesvVJSSk+mMKDuB7hb3QOzVSPofh89wqU4CEKbKEvIwF2n81FK+B2v8eav/nRhC0dmp8q8Tg9+csmL2bw9yjTdDM4BrWjg3rpw2yhKGymiW+HQvq51H73876xbcoiXjpTNsq9j/eBOs2Z/t5JSVIiGIJInkSjKIHmVsccFD7r7yfgfLp4YNqCwn743kLivdtwb5HWv7zUvhcXk52VDdidiTASzg7shY51H5KweV3TOCrbKSSw9pnBmxgHNn/WMN/bvnjZLMkj02JO6r/moK1T9Jje2FpIZHSKuS4tjcV7kgBEjZ/jmHAXcT03DhIEIqVLa41iKhlCyJBgbIFkaCAO6Kl8WJ0R0yQJUxJ2YJIUMMdkaySzY5UmW1x7ZIw2BK6VyoU5I5i52Fb1npI+WUnr4CQxcuqXJeH1j4aH1h73peoonyhvRKk106WMBdlzF9+M4PNxlbAthfbbHDcWauNyBhN82U9vYlNztlfx7aGrSKP9ZB5dC6sBf2tgJwUyXFkuIE8G4F8m4G8vW4S5EVyrqHWRYCs+RpAS/KMKzPlgYybARly3w1bAu+6oRW4IY1IGBsJHW/jBARwCC3T7IWsgtbKHn9c6LtWdicwA9Cq8ZN8RehZNf5fAQYARskpBcyEpL8AAAAASUVORK5CYII=',
{
  "referrer": "",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET"
});

console.log(response);

}


main();