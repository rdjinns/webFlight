$(document).ready(function(){
  $('.delete-avion').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/avions/'+id,
      success: function(response){
        alert('Supprimer avion ?');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});

$(document).ready(function(){
  $('.delete-user').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/users/'+id,
      success: function(response){
        alert('Supprimer utilisateur ?');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});

