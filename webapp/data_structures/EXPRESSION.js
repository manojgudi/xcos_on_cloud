function EXPRESSION () {

    EXPRESSION.prototype.define = function EXPRESSION() {
        this.in = [[1], [1]];
        this.out = 1;
        this.txt = "(u1>0)*sin(u2)^2";
        /*
        call for scilab function
        
        deff("%foo(u1,u2)",txt)
        [%ok1,ipar,rpar,nz]=compile_expr(%foo)
        
        */
        var model = scicos_model();
        model.sim = list(new ScilabString(["evaluate_expr"]), new ScilabDouble([4]));
        model.in = new ScilabDouble([this.in]);
        model.out=new ScilabDouble([this.out]);
	    model.rpar=rpar;
	    model.ipar=ipar;
	    model.nzcross=nz;
	    model.nmode=nz;
	    model.dep_ut = new ScilabBoolean([true,false]);

	    var exprs = [string(size(in1,"*"));txt;"1"];

	    var gr_i = [];
	    this.x=new standard_define(new ScilabDouble([5,2]),model,exprs,gr_i);
	    return new BasicBlock(this.x)
    }
    EXPRESSION.prototype.set = function EXPRESSION() {
        this.in = parseFloat((arguments[0]["in"]))
        this.exx = arguments[0]["exx"]
        this.usenz = parseFloat((arguments[0]["usenz"]))
        
        if(this.exx.length == 0){
            this.exx = "0";
        }
        
        if(this.in == 1){
            this.nini = 8;
        }else{
            this.nini = this.in;
        }
        
        this.head="%foo(";
        for(var i = 1; i <= this.nini-1; i++){
        
            this.head=this.head+"u"+i.toString()+",";
            
        }
        this.head=this.head+"u"+this.nini.toString()+")";
        var ok = null;
        /*
        need to put in other 
         ok=execstr("deff(%head,%exx)","errcatch")==0
        */
        if(!ok){
            alert("Erroneous expression "+output);
        }else{
            if(this.in>1){
                //[model,graphics,ok]=check_io(model,graphics,ones(1,%nin),1,[],...[])
            }else{
                //[model,graphics,ok]=check_io(model,graphics,-1,1,[],...[])
            }
            if(ok){
               // [ok,%ok1,ipar,rpar,%nz]=compiler_expression(%foo) need to put other code
               if(!ok){
                    alert("Erroneous expression"+output);
               }else{
                    if(ok1){
                        this.x.model.rpar=rpar;
                        this.x.model.ipar=ipar;
                        if(this.usenz){
                            this.x.model.nzcross=nz;
                            this.x.model.nmode=nz;
                        }else{
                            this.x.model.nzcross=0;
                            this.x.model.nmode=0;
                        }
                        this.x.graphics.exprs=exprs;
                    }
               }
            }
        }
        


    }
    EXPRESSION.prototype.get = function EXPRESSION() {
         var options={
            in:["number of inputs",this.in],
            exx:["scilab expression",this.exx.toString()],
            usenz:["use zero-crossing (0: no, 1 yes)",this.usenz],
        }
        return options
    }
    EXPRESSION.prototype.details = function EXPRESSION() {
        return this.x;
    }
    EXPRESSION.prototype.get_popup_title = function EXPRESSION() {
        var set_param_popup_title="Give a scalar scilab expression using inputs u1, u2,... <br>If only one input, input is vector [u1,u2,...] (max 8) <br>ex: (dd*u1+sin(u2)>0)*u3 <br> Note that here dd must be defined in context";
        return set_param_popup_title
    }
    EXPRESSION.prototype.getDimensionForDisplay = function EXPRESSION(){
        var dimension = { width: 100, height: 40 };
        return dimension
    }

}
