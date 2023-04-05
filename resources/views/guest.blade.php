@extends('layouts.' . $layout)

@section('content')
<div class="container">
    <h1 class="text-center">Welcome</h1>
    <br/><br/>
    <h4 class="text-center">We Will Bring Something Interesting For You Soon!</h4>
    <br/><br/>
    <h5 class="text-center">Stay Tuned!</h5>
    <div>
        <input id="search_query" />
        <ul id="search_suggestions"></ul>
    </div>
</div>
@endsection

@section('script')
<script>
    (function(){
        var searching = false;
        $("#search_query").on("keyup", function(){
            var term = $(this).val().trim(), prevTerm;
            if((term || term != prevTerm) && !searching){
                prevTerm = term;
                searching = true;
                $.ajax({
                    url: "{{url('/query')}}",
                    data: {q: term}
                })
                .complete(function(){
                    searching = false;
                })
                .success(function(data){
                    $("#search_suggestions").html(data.map(function(item){
                        return "<li>"+ item.content +"</li>";
                    }).join(""));
                });
            }
        });
    })();
</script>
@endsection
