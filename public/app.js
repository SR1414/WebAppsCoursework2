

//fetch('/getuser').then(response => {
//});


var testvue = new Vue({
  el: '#root',
  data: {
    search: '',
    checkedLocation: [],
    selectedschool: [],
    filterRating: '',
    filterPrice: '',
    courses: []
  }, methods: {
    reset: function () {
      this.search = '';
      this.checkedLocation = [];
      this.filterRating = '';
      this.filterPrice = '';
    }
  },

  computed: {
    filteredCourses: function () {
      fetch('/courses').then(
        function (response) {
          response.json().then(
            function (text) {
              testvue.courses = text;
            }
          )
        }
      )
      var topics = this.search;
      var locations = this.checkedLocation;
      var schools = this.selectedschool;
      var rating = this.filterRating;
      var price = this.filterPrice;
      return this.courses.filter(function (course) {
        var topicMatch = false;
        var locationMatch = false;
        var schoolMatch = false;
        var ratingMatch = false;
        var priceMatch = false;
        if (topics.length > 0) {
          if (course.topic.startsWith(topics)) {
            topicMatch = true;
          };
        }
        else {
          topicMatch = true;
        }
        if (locations.length > 0) {
          if (locations.includes(course.location)) {
            locationMatch = true;
          }
        }
        else {
          locationMatch = true;
        }
        if (schools.length > 0) {
          if (schools.includes(course.school)) {
            schoolMatch = true;
          }
        }
        else {
          schoolMatch = true;
        }
        if (rating.length > 0) {
          if (rating.includes(course.rating)) {
            ratingMatch = true;
          }
        }
        else {
          ratingMatch = true;
        }

        if (price.length > 0) {
          if (price >= course.price) {
            priceMatch = true;
          }
        }
        else {
          priceMatch = true;
        }
        return topicMatch && locationMatch && schoolMatch && ratingMatch && priceMatch;
      })
    }
  }
})

////////////////////////////////////SIGNUP////////////////////////////////////////
var reg = new Vue({
  el: '#reg',
  data: {
    email: '',
    firstname: '',
    lastname: '',
    usertype: '',
    password: '',
    seen: true,
    users: []

  },
  methods: {
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    Getusersfromdb: function getusers() {
      var yes;
      var data = {
        email: reg.email,
        firstname: reg.firstname,
        lastname: reg.lastname,
        usertype: reg.usertype,
        password: reg.password,
        activity: []
      }
      if (!this.email || !this.firstname || !this.lastname || !this.password || !this.usertype) {
        alert("Ensure all fields are filled in with valid information");
        return;
      }
      if (!this.validEmail(this.email)) {
        alert("Invalid Email");
        return;
      }
      //asks server for list of users and checks if it is empty or not
      fetch('/newuser', {
        method: 'POST',
        // or 'PUT'   
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          console.log(data.message);
          console.log((data.firstname.length > 1));
          if (data.firstname.length >= 1) {
            reg.seen = false;
            this.reg.email = '',
            this.firstname = '',
            this.lastname = '',
            this.usertype = '',
            this.password = ''
          }
          alert(data.message);
        })
    }
  }
});
//////////////////////////login//////////////////////////////


var loginuser = new Vue({
  el: '#loginform',
  data: {
    logemail: '',
    logpassword: '',
    seen: true,
    loggeduser: []

  },
  methods: {
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    login: function loguserin() {
      var logdata = {
        email: loginuser.logemail,
        password: loginuser.logpassword
      }

      if (!this.logemail || !this.logpassword) {
        alert("Ensure all fields are filled in with valid information");
        return;
      }
      if (!this.validEmail(this.logemail)) {
        alert("Invalid Email");
        return;
      }
      console.log(logdata);
      fetch('/loguser', {
        method: 'POST',
        // or 'PUT'   
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logdata),
      })
        .then((response) =>
          response.json())
        .then((data) => {
          console.log(data.message);
          console.log(data.firstname);
          console.log(data.firstname.length);
          if (data.firstname.length >= 1) {
            loginuser.seen = false;
            var info = {
              email: data.email,
              firstname: data.firstname,
              lastname: data.lastname,
              usertype: data.usertype,
              password: data.password,
              activity: data.activity,
              reviews: data.reviews,
            }
            userinfo.currentuser = info;

          }
          alert(data.message);
        })

    }
  }
});

var userinfo = new Vue({
  el: '#app',
  data: {
    UserInfo: [],
    Email: '-',
    Firstname: '-',
    Lastname: '-',
    UserType: '-',
    Message: "Not Logged In",
    Activity: [],
    seen: 'false',
    selectedClassId: '',
    retrievedActivity: [],
    SelectedTopic: '',
    SelectedSchool: '',
    UserReview: '',
    Reviews: [],
    currentuser: []

  },
  methods: {
    getuserinfo: function userinfo() {
      var loggedUser;
      console.log(!this.currentuser);
      if (!this.currentuser) {
        loggedUser = [
          { Email: "-", FirstName: "-", LastName: "-", UserType: "-", Message: "Not Logged in" }
        ];
        var noactivity = [{ topic: '-', location: '-', school: '-', price: '-', time: '-', length: '-', rating: '-', reviews: '-'}];
        this.UserInfo = loggedUser;
        this.Email = "-";
        this.Firstname = "-";
        this.Lastname = "-";
        this.UserType = "-";
        this.Message = "Not Logged In";
        this.retrievedActivity = noactivity;
        this.Reviews = "-";

      }
      if (this.currentuser) {
        var userinfo = JSON.parse(localStorage.getItem("LoggedInUser"));
        loggedUser = [
          { Email: this.currentuser.email, 
            FirstName: this.currentuser.firstname, 
            LastName: this.currentuser.lastname, 
            Password: this.currentuser.password,
            UserType: this.currentuser.usertype, 
            Message: "Logged in", 
            Activity: this.currentuser.activity, 
            Reviews: this.currentuser.reviews
          }
        ];
        this.UserInfo = loggedUser;
        this.retrievedActivity = this.currentuser.activity;
      }


    },
    loguserout: function logout() {
      if (this.currentuser) {
        this.currentuser = [];
        loginuser.seen = true;
        this.getuserinfo();
        alert("logged Out")
        return;
      }
      if (!this.currentuser) {
        alert("Not Logged In");
        return;
      }

    },
    AddClass: function addclass() {
      if(!this.SelectedTopic || !this.SelectedSchool || !this.UserReview){
        alert("Please fill in the relevant fields")
        return;
      }
      if(!this.currentuser){
        alert("Please log in to enter review");
        return;
      }
      var reviewinfo = {
        email: this.currentuser.email,
        firstname: this.currentuser.firstname,
        lastname: this.currentuser.lastname,
        selectedtopic: this.SelectedTopic,
        selectedschool: this.SelectedSchool,
        userreview: this.UserReview
      };
      console.log(reviewinfo);
      fetch('/newreview', {
        method: 'POST',
        // or 'PUT'   
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewinfo),
      })
        .then((response) =>
          response.json())
        .then((data) => {
          console.log("hello")
          alert(data);
        })
    }

  }
});