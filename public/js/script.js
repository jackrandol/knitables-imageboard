(function () {
  Vue.component("imagemodal", {
    template: "#my-component",
    props: ["id"],
    data: function () {
      return {
        url: "",
        title: "",
        description: "",
        username: "",
        comments: [],
        comment: "",
        usernamecomment: "",
        previmage: "",
        nextimage: "",
        prevImageExists: true,
        nextImageExists: true,
        commentErrorMessage: false,
      };
    },

    mounted: function () {
      var me = this;

      axios.get(`/imagecomments/${this.id}`).then(function (response) {
        me.comments = response.data;
      });

      axios.get(`/image/${this.id}`).then(function (response) {
        if (response.data.url == undefined) {
          return me.$emit("message");
        }

        me.url = response.data.url;
        me.title = response.data.title;
        me.description = response.data.description;
        me.username = response.data.username;
        me.previmage = response.data.prevImageId;
        me.nextimage = response.data.nextImageId;

        if (me.previmage == null) {
          me.prevImageExists = false;
        } else {
          me.prevImageExists = true;
        }

        if (me.nextimage == null) {
          me.nextImageExists = false;
        } else {
          me.nextImageExists = true;
        }
      });
    },

    watch: {
      //id here refers to the prop value
      id: function () {
        var me = this;
        axios.get(`/imagecomments/${this.id}`).then(function (response) {
          me.comments = response.data;
        });

        axios.get(`/image/${this.id}`).then(function (response) {
          if (response.data.url == undefined) {
            return me.$emit("message");
          }

          me.url = response.data.url;
          me.title = response.data.title;
          me.description = response.data.description;
          me.username = response.data.username;
          me.previmage = response.data.prevImageId;
          me.nextimage = response.data.nextImageId;

          if (me.previmage == null) {
            me.prevImageExists = false;
          } else {
            me.prevImageExists = true;
          }

          if (me.nextimage == null) {
            me.nextImageExists = false;
          } else {
            me.nextImageExists = true;
          }
        });
      },
    },

    methods: {
      handleMessage: function () {
        this.$emit("message");
      },

      handleComment: function (e) {
        e.preventDefault();
        var me = this;
        var comment = {
          username: this.usernamecomment,
          comment: this.comment,
          image_id: this.id,
        };

        axios
          .post("/comment", comment)
          .then(function (resp) {
            if (resp.data.name == "error") {
              me.commentErrorMessage = true;
            } else {
              me.comments.push(resp.data[0]);
              me.comment = "";
              me.usernamecomment = "";
              me.image_id = "";
              me.commentErrorMessage = false;
            }
          })
          .catch(function (error) {
            return (me.commentErrorMessage = true);
          });
      },

      prevImage: function () {
        this.$emit("previmage", this.previmage);
      },

      nextImage: function () {
        this.$emit("nextimage", this.nextimage);
      },

      deleteImage: function () {
        var me = this;

        axios.get(`/deleteimage/${this.id}`).then(function (response) {
          return me.$emit("deleteimage", me.id);
        });
      },
    },
  });

  new Vue({
    el: "#main",
    data: {
      id: location.hash.slice(1),
      images: [],
      title: "",
      description: "",
      username: "",
      file: null,
      url: "",
      comment: "",
      comments: "",
      usernamecomment: "",
      lastid: "",
      showbutton: true,
      errormessage: false,
    },
    mounted: function () {
      var me = this;
      axios
        .get("/images")
        .then(function (response) {
          me.images = response.data;
          var lastItemIndex = response.data.length - 1;
          var lastId = response.data[lastItemIndex].id;
          me.lastid = lastId;
        })
        .catch(function (err) {
          console.log(err);
        });

      addEventListener("hashchange", function () {
        me.id = location.hash.slice(1);
      });
    }, //mounted ends here

    methods: {
      handleClick: function (e) {
        e.preventDefault();

        let fileInput = document.querySelector(".chooseFile");
        var formData = new FormData();
        var me = this;

        formData.append("title", this.title);
        formData.append("description", this.description);
        formData.append("username", this.username);
        formData.append("file", this.file);
        axios
          .post("/upload", formData)
          .then(function (resp) {
            me.images.unshift(resp.data);
            me.title = "";
            me.username = "";
            me.description = "";
            fileInput.innerText = "Choose a file";
            me.errormessage = false;
          })
          .catch(function (error) {
            console.log("errormessage from POST /upload:", error);
            return (me.errormessage = true);
          });
      },

      handleChange: function (e) {
        let fileName = document.querySelector(".chooseFile");
        fileName.innerText = e.target.files[0].name.slice(0, 15) + " . . .";
        this.file = e.target.files[0];
      },

      handleMessage: function () {
        this.id = null;
        location.hash = "";
      },
      selectImage: function (imageid) {
        this.id = imageid;
      },
      moreButton: function () {
        var me = this;
        axios
          .get(`/moreimages/${this.lastid}`)
          .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
              if (response.data[i].lowestId === response.data[i].id) {
                me.showbutton = false;
              }
            }

            me.images.push.apply(me.images, response.data);
            var lastItemIndex = response.data.length - 1;
            var lastId = response.data[lastItemIndex].id;
            me.lastid = lastId;
          })
          .catch(function (err) {
            console.log(err);
          });
      },

      prevImage: function (e) {
        location.hash = e;
        this.id = e;
      },

      nextImage: function (e) {
        location.hash = e;
        this.id = e;
      },

      deleteImage: function () {
        location.reload();
      },
    }, // end of methods
  });
})();
