/// routing

// Default layout is ApplicationLayout (define in html)
Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
	this.render('welcome',{
		to:"main"
	});
});
Router.route('/images', function () {
        this.render('modal',{
                to:"modal"
        });
	this.render('navbar',{
               	to:"navbar"
        });
        this.render('images',{
                to:"main"
        });
});

Router.route('/image/:_id', {action : function () {
        this.render('navbar',{
                to:"navbar"
        });
        this.render('image',{
                to:"main",
		data:function(){
			var img = JSON.stringify(Images.findOne({_id:this.params._id}));
			var str = img.replace("img/", "/img/");
			return JSON.parse(str);
		},
        });
},
onAfterAction: function () {
	$('#image_popup').modal('hide');
//	this.next();
}

});

/// infiniscroll

Session.set("imageLimit", 8);
lastScrollTop = 0; 
$(window).scroll(function(event){
// test if we are near the bottom of the window
if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
  // where are we in the page? 
  var scrollTop = $(this).scrollTop();
  // test if we are going down
  if (scrollTop > lastScrollTop){
    // yes we are heading down...
   Session.set("imageLimit", Session.get("imageLimit") + 4);
  }

  lastScrollTop = scrollTop;
}
    
});


/// accounts config

Accounts.ui.config({
passwordSignupFields: "USERNAME_AND_EMAIL"
});

/// 

Template.images.events({
'click .js-image':function(event){
//    	$(event.target).css("width", "50px");
	Session.set("selectedImageId",this._id);
	$('#image_popup').modal("show");
}, 
'click .js-del-image':function(event){
   var image_id = this._id;
   console.log(image_id);
   // use jquery to hide the image component
   // then remove it at the end of the animation
   $("#"+image_id).hide('slow', function(){
    Images.remove({"_id":image_id});
   })  
}, 
'click .js-rate-image':function(event){
  var rating = $(event.currentTarget).data("userrating");
  console.log(rating);
  var image_id = this.data_id;
  console.log(image_id);

  Images.update({_id:image_id}, 
                {$set: {rating:rating}});
}, 
'click .js-show-image-form':function(event){
  $("#image_add_form").modal('show');
}, 
'click .js-set-image-filter':function(event){
	console.log(this.createdBy);
	if (this.createdBy != undefined){
		Session.set("userFilter", this.createdBy);
	} else
	{
		Session.set("userFilter", "anonymous");
	}
}, 
'click .js-unset-image-filter':function(event){
    Session.set("userFilter", undefined);
}, 
});



Template.image_add_form.events({
'submit .js-add-image':function(event){
  var img_src, img_alt;

    img_src = event.target.img_src.value;
    img_alt = event.target.img_alt.value;
    console.log("src: "+img_src+" alt:"+img_alt);
    if (Meteor.user()){
      Images.insert({
        img_src:img_src, 
        img_alt:img_alt, 
        createdOn:new Date(),
        createdBy:Meteor.user()._id
      });
  }
    $("#image_add_form").modal('hide');
 return false;
}
});


//Template.image_popup.events({
//'hidden.bs.modal #image_popup':function(event){
//        console.log("ok");
//	this.next();
//},
//});
