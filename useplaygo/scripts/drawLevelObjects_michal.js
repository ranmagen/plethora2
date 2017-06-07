     
     
     function DrawSentences() {
        var sentencesCnt = sentences.length;

        for (var i = 0; i < sentences.length; i++) {
            var slots = sentences[i].slots;
            var slotsCnt = slots.length - 1;

            $('<div></div>').attr('id', 'sentence' + i).addClass('sentence').appendTo('#slots-container');

            for (var j = slotsCnt; j >= 0; j--) {            
                $('<div></div>').data('number', i + "_" + j).attr('id', 'slot' + i + '_' + j).addClass("slot").appendTo('#sentence' + i).droppable({
                    accept: '#cards-container div',                    
                    hoverClass: 'hovered',
                    drop: HandleCardDrop
                });

                var slotId = "#slot" + i + '_' + j;              
                drowCardContent(slots[j], slotId);
            }
            $('<div></div>').addClass('sentence-margin').insertAfter('#sentence' + i);
        }
    }


    function DrawCards() {
        var cardsCnt = cards.length - 1;
        for (var i = cardsCnt; i >= 0; i--) {
            $('<div></div>').data('number', i).attr('id', 'card' + i).appendTo('#cards-container').addClass("card").draggable({
                containment: '#sidebar',
                stack: '#sidebar',//'#slots-container div',
                cursor: 'move',
                revert: false
                // start: function(event, ui) {            
                // },
                //stop: function(event, ui)
               // {
                   // alert('stop: dropped=' + ui.helper.data('dropped'));
                    // Check value of ui.helper.data('dropped') and handle accordingly...
                //}
            });
            var cardId = "#card" + i;              
            drowCardContent(cards[i], cardId);
        }
    }



    function drowCardContent(card, appentTo)
    {        
       if (card.content == "question") {
                    $("<img src='images/rules/question.png'></img>").appendTo(appentTo);
                    $(appentTo).addClass("question").addClass(card.type);
                }
                else {
                        if(card.type == "conjunction")
                        {
                            $("<p>" + card.content_h + "</p>").appendTo(appentTo);
                            $(appentTo).addClass(card.type);
                        }
                        else if (card.type == "shape"){
                            $(appentTo).addClass(card.type);
                            $("<div class='" + card.content.type + " " + card.content.color + " centered'></div>").appendTo(appentTo);
                            if (card.content.type == "triangle") {
                                var color = $(appentTo + " > div").css("background-color");
                                $(appentTo + " > div").css("background", "none").css("color", color);
                            }
                        }
                        else //icon for method or param
                        {
                            $("<img src='images/rules/" + card.content + ".png' ></img>").appendTo(appentTo);
                            $(appentTo).addClass(card.type);
                        }                     
                    }
                    var tooltip = "";
                    if(card.content == "question")
                    {
                        tooltip = "*גררו לכאן*";
                    }
                    else
                    {
                        switch(card.type)
                        {
                            case "method":
                            {
                                switch(card.content)
                                {
                                    case "hit":
                                        tooltip  = "מתנגש";
                                        break;
                                    case "created":
                                        tooltip  = "נוצר";
                                        break;
                                    case "deleted":
                                        tooltip  = "נעלם";
                                        break;
                                }        
                                break;
                            }
                            case "wall":
                            {
                                switch(card.content)
                                {
                                    case "any_wall":
                                        tooltip = "במסגרת";
                                        break;
                                }
                            }
                            case "shape":
                            {
                                switch(card.content.type)
                                {
                                    case "circle":
                                        tooltip = "עיגול";
                                        break;
                                    case "square":
                                        tooltip = "ריבוע";
                                        break;
                                    case "triangle":
                                        tooltip = "משולש";
                                        break;
                                }
                            }
                        }
                    }
               
                  if(tooltip != "")
                  {
                      $(appentTo).addClass("tooltip");
                      $(" <span class='tooltiptext'>"+ tooltip +"</span>").appendTo(appentTo);
                  }
                    
    }

    function HandleCardDrop(event, ui) {
        var slotData = $(this).data('number');
        var cardNum = ui.draggable.data('number');
        var sentenceNum = slotData.split("_")[0];
        var sentence = sentences[sentenceNum];
        var slotNum = slotData.split("_")[1];
        //if (sentence.slots[slotNum].question == true) {
        if (sentence.slots[slotNum].content == "question") {
            ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
            ui.draggable.draggable('option', 'revert', false);
        }  
        // else
        // {
        //     alert("out");
        // }
        sentence.slots[slotNum].card = cardNum;
        CheckIfSentenceCompleted(sentence);
    }

    function BlinkCloseLightColor()
    {
         $("#open-light").css({ fill: "#7799bb" });
    }

    function CheckIfSentenceCompleted(sentence) {
        var slots = sentence.slots;
        for (var i = 0; i < slots.length; i++) {

            if (slots[i].content == "question" && (slots[i].card == undefined || slots[i].card < 0)) {
                return false;
            }
        }
        sentence.completed = true;

var rules = GetPlayGoRules();
SendRulesToPlayGo(rules);


        BlinkCloseLightColor();
        return true;
    }


/********************************* */
function GetPlayGoRules()
{
	//var rules = playgoRulesList();
	//alert(uniqueUserid);
	//rules.userid = uniqueUserid;
    var rules = new Array();

    for(s in sentences)
    {
        var rule = new playgoRule()
        var sentence = sentences[s];
        if(sentence.completed)
        {
            //When
              var whenObject1 = GetSlotOrCard(sentence, 1);//.content;
              var whenObject2 = GetSlotOrCard(sentence, 3);
              var method = sentence.slots[2].content;              
              newRuleEvent = new playgoEventRule("WAIT", 
                                                ParseSlotObject(whenObject1), //.content.type,
                                                ParseSlotType(whenObject1.type), 
                                                ParseSlotObject(whenObject2), //.content.type,
                                                ParseSlotType(whenObject2.type), 
                                                ParseMethodName(method), []
                                                );
            
            rule.addRuleEvent(newRuleEvent);
             
            //DO
              var thenSlotNum = GetThenSlotNumber(sentence);
              var thenObject = GetSlotOrCard(sentence, thenSlotNum + 1);
              var actionMethod = GetSlotOrCard(sentence, thenSlotNum + 2).content;
              var params = [];
              params.push(thenObject.content.color);
              var size = thenObject.content.size == undefined ? "medium" : thenObject.content.size; 
              params.push(size);
             

              newRuleEvent = new playgoEventRule("DO", 
                                                ParseSlotObject(thenObject), 
                                                ParseSlotType(thenObject.type), 
                                                ParseSlotObject(thenObject),
                                                ParseSlotType(thenObject.type),
                                                ParseMethodName(actionMethod), 
                                                params                                                
                                                );
              rule.addRuleEvent(newRuleEvent);                                      
                                        
        }
        rules.push(rule);
    }
    var rulesList = {rules: rules, userid: uniqueUserid};
    return rulesList; //rules;
}

function SendRulesToPlayGo(rules)
{
    var server = serverUrl + "newrule";
	 $.ajax({
	        url: server,
	        type: 'PUT',
	        dataType: 'json',
	        data: JSON.stringify(rules),
	        contentType: 'application/json',
	        mimeType: 'application/json',
	        accept: 'application/json',
	 
	        success: function (data) { //data is an object
	        	// for (var i=0;i<data.length;i++) {
		        // 	var event = playgoEvent.fromObject(data[i]);
                //     alert(event.toString());
	            // 	//$('.out-debug-id').append("Recieved data: " + event.toString() + "<br>");
           	
	            // }
	           	//save the userid you got
	    		var useridnew = data.userid;
	    		if(useridnew != uniqueUserid) {
	    			uniqueUserid = useridnew;
	    		}
		            
		 
	        	
	        },
	        error:function(data,status,er) {
	            alert("error: "+data+" status: "+status+" er:"+er);
	        }
	 		}); 

}





function playgoRule () {
	this.events = [];
	
	
	this.addRuleEvent = function(playgoEventRule) {
		this.events.push(playgoEventRule);
	}
	
	this.getRuleEvents = function() {
		return this.events;
	}
}


function ParseSlotObject(slot)
{
    if(slot.type == "wall")
    {
        return "topWall";
    }
    else
    {
        return  slot.content.type
    }
   
}

function ParseSlotType(type)
{
    switch(type)
    {
        case "shape":
        {
            return "Shape";
        }
        case "wall":
        {
            return "Wall";
        }
    }
}

function ParseMethodName(method)
{
    switch(method)
    {
        case "hit":
        {
            return "meet";
        }
        case "created":
        {
            return "appear";
        }
    }
}


    function GetThenSlotNumber(sentence) {
        var slotsCnt = sentence.slots.length - 1;
        for (var i = slotsCnt; i >= 0; i--) {
            if (sentence.slots[i].content == "then")
                return i;
        }
    }

    function GetSlotOrCard(sentence, slotNum)
    {
        if (sentence.slots[slotNum].content == "question") {
            var cardNum = sentence.slots[slotNum].card;
            return cards[cardNum];
        }
        else {
            return sentence.slots[slotNum];
        }
    }

