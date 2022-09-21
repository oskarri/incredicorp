    <script type="module">
      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
      import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
      import { getMessaging } from "firebase/messaging/sw";
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries

      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      const firebaseConfig = {
        apiKey: "AIzaSyC2gsYZ52nbw4XodvhJEIZPrItqsJOHFpE",
        authDomain: "be-61be5.firebaseapp.com",
        projectId: "be-61be5",
        storageBucket: "be-61be5.appspot.com",
        messagingSenderId: "1037477194727",
        appId: "1:1037477194727:web:644dac00a57a637f342b42",
        measurementId: "G-PQ4W2QG90Y"
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);
      const messaging = getMessaging(app);

      // Add the public key generated from the console here.
      messaging.getToken({vapidKey: "BHGWtmqOHwchHSGMJ7TqORwRVUAUComjUk1vwk7DkgwP7MXviNIcp2CoIyLNrzF4P3dx6ZA03gOLyAP7yIVI9vk"});
        
      function requestPermission() {
        console.log('Requesting permission...');
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
          }});
            
        import { getMessaging, getToken } from "firebase/messaging";

        // Get registration token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        const messaging = getMessaging();
        getToken(messaging, { vapidKey: 'BHGWtmqOHwchHSGMJ7TqORwRVUAUComjUk1vwk7DkgwP7MXviNIcp2CoIyLNrzF4P3dx6ZA03gOLyAP7yIVI9vk' }).then((currentToken) => {
          if (currentToken) {
            // Send the token to your server and update the UI if necessary
            // ...
          } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          // ...
        });
      }
        
      onMessage(messaging, (payload) => {
          console.log('Message received. ', payload);
          // ...
      });
        
      onBackgroundMessage(messaging, (payload) => {
          console.log('[firebase-messaging-sw.js] Received background message ', payload);
          // Customize notification here
          const notificationTitle = 'Background Message Title';
          const notificationOptions = {
            body: 'Background Message body.',
            icon: '/firebase-logo.png'
          };

          self.registration.showNotification(notificationTitle,
            notificationOptions);
      });
     
    </script>