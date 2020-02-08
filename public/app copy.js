



var testvue = new Vue({
  el: '#root',
  data: {
    search: '',
    checkedLocation: [],
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
      );
      var topics = this.search;
      var locations = this.checkedLocation;
      var rating = this.filterRating;
      var price = this.filterPrice;
      return this.courses.filter(function (course) {
        var topicMatch = false;
        var locationMatch = false;
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
        return topicMatch && locationMatch && ratingMatch && priceMatch;
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

  },
  methods: {
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    signup: function register() {
      var userlist = [];
      var email = this.email;
      var firstname = this.firstname;
      var lastname = this.lastname;
      var usertype = this.usertype;
      var password = this.password;
      var activity = [];
      if (!this.email || !this.firstname || !this.lastname || !this.password || !this.usertype) {
        alert("Ensure all fields are filled in with valid information");
        return;
      }
      if (!this.validEmail(this.email)) {
        alert("Invalid Email");
        return;
      }
      if (localStorage.getItem("MyUser") == null) {
        userlist.push({
          Email: email,
          Firstname: firstname,
          Lastname: lastname,
          Usertype: usertype,
          Password: password,
          Activity: activity
        });
        var myuserlistserialized = JSON.stringify(userlist);
        localStorage.setItem("MyUser", myuserlistserialized);
        console.log("ADDED IF DOESNT EXIST");
        alert("Account Created");

        this.email = '';
        this.firstname = '';
        this.lastname = '';
        this.usertype = '';
        this.password = '';
        return;
      };
      if (localStorage.getItem("MyUser") !== null) {
        var myusers = JSON.parse(localStorage.getItem("MyUser"));
        var i = 0;
        for (i = 0; i < myusers.length; i++) {
          if (myusers[i].Email == this.email) {
            alert("Email Already Registered");
            return;
          } else {
            var newuser = {
              Email: this.email,
              FirstName: this.firstname,
              LastName: this.lastname,
              Usertype: this.usertype,
              Password: this.password,
              Activity: activity
            }
            
            var existingusers = JSON.parse(localStorage.getItem("MyUser"));
            existingusers.push(newuser);
            console.log(newuser);
            var myuserlistserialized = JSON.stringify(existingusers);
            var test = JSON.parse(myuserlistserialized);
            console.log(test[1]);
            localStorage.setItem("MyUser", myuserlistserialized);
            console.log("Account added to users");
            alert("Account Created");
            return;
          }

        }

      }
    }
  }
});
//////////////////////////login//////////////////////////////


var loginuser = new Vue({
  el: '#loginform',
  data: {
    logemail: '',
    logpassword: '',
    seen: true

  },
  methods: {
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    login: function loguserin() {
      var email = this.logemail;
      var password = this.logpassword;
      var i = 0;
      var userlist = JSON.parse(localStorage.getItem("MyUser"));
      var serveruserlist = [];
      var validuser;
      fetch('/users').then(
        function (response) {
          response.json().then(
            function (text) {
              serveruserlist = text;
              //console.log(serveruserlist)
            }
          )
        }
      );


      if (!this.logemail || !this.logpassword) {
        alert("Ensure all fields are filled in with valid information");
        return;
      }
      if (!this.validEmail(this.logemail)) {
        alert("Invalid Email");
        return;
      }
      if (localStorage.getItem("MyUser") == null) {
        alert("Invalid Email/Password");
        return;
      }
      if (localStorage.getItem("MyUser") !== null) {
        for (i = 0; i < userlist.length; i++) {
          if (userlist[i].Email == this.logemail) {
            var currentuserJSON = JSON.stringify(userlist[i]);
            var currentuser = userlist[i];
            if (currentuser.Password == this.logpassword) {
              localStorage.setItem("LoggedInUser", currentuserJSON);
              alert(
                "log In Successful. Hello " + currentuser.FirstName + "!"
              )
              userinfo.getuserinfo();
            }if(currentuser.Password !== this.logpassword){
              alert("Invalid Email/Password");
            return;
            }
            //this.seen = false;

          }


        }
      }

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
    retrievedActivity: []

  },
  methods: {
    getuserinfo: function userinfo() {
      var loggedUser;
      if (localStorage.getItem("LoggedInUser") == null) {
        loggedUser = [
          { Email: "-", FirstName: "-", LastName: "-", UserType: "-", Message: "Not Logged in" }
        ];
        var noactivity = [{ topic: '-', location: '-', price: '-', time: '-', length: '-', rating: '-', classID: '-' }];
        this.UserInfo = loggedUser;
        this.Email = "-";
        this.Firstname = "-";
        this.Lastname = "-";
        this.UserType = "-";
        this.Message = "Not Logged In";
        this.retrievedActivity = noactivity;

      }
      if (localStorage.getItem("LoggedInUser") !== null) {
        var userinfo = JSON.parse(localStorage.getItem("LoggedInUser"));
        loggedUser = [
          { Email: userinfo.Email, FirstName: userinfo.Firstname, LastName: userinfo.Lastname, UserType: userinfo.Usertype, Message: "Logged in", Activity: userinfo.Activity }
        ];
        this.UserInfo = loggedUser;
        this.Email = userinfo.Email;
        this.Firstname = userinfo.Firstname;
        this.Lastname = userinfo.Lastname;
        this.UserType = userinfo.Usertype;
        this.Message = "Logged in"
        this.Activity = userinfo.Activity;
        this.retrievedActivity = userinfo.Activity;
      }


    },
    loguserout: function logout() {
      if (localStorage.getItem("LoggedInUser") !== null) {
        localStorage.removeItem("LoggedInUser");
        this.Email = "-";
        this.Firstname = "-";
        this.Lastname = "-";
        this.UserType = "-";
        this.Message = "Not Logged In";
        loginuser.seen = true;
        this.getuserinfo();
        return;
      }
      if (localStorage.getItem("LoggedInUser") == null) {
        alert("Not Logged In");
        return;
      }

    },
    AddClass: function addclass() {
      var StoredUsers = JSON.parse(localStorage.getItem("MyUser"));
      var courses = testvue.courses;
      var CurrentLoggedinUser = JSON.parse(localStorage.getItem("LoggedInUser"));
      var userJSON = null;
      var storeduserJSON
      var i = 0;
      for (i = 0; i < courses.length; i++) {
        if (courses[i].classID == this.selectedClassId) {
          console.log("works");
          CurrentLoggedinUser.Activity.push(courses[i]);
          userJSON = JSON.stringify(CurrentLoggedinUser);
          localStorage.setItem("LoggedInUser", userJSON);
          this.retrievedActivity = CurrentLoggedinUser.Activity;


          var x = 0;
          for (x = 0; x < StoredUsers.length; x++) {
            if (StoredUsers[x].Email == CurrentLoggedinUser.Email) {
              StoredUsers[x] = CurrentLoggedinUser;
              storeduserJSON = JSON.stringify(StoredUsers);
              localStorage.setItem("MyUser", storeduserJSON);

            }
          }
        }
      }
    }

  }
});