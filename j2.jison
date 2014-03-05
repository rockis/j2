/* description: Parses words out of html, ignouring html in the parse, but returning it in the end */

/* lexical grammar */
%lex
%s for if else elif endfor endif

%%
"{%"\s*"for"\s+(\w+)\s+"in"\s+(\w+)\s*"%}"	%{ 
												this.begin('for');
												yy.startFor(yy_.matches[2], yy_.matches[1]);
												return 'FOR_START'; 
											%}
<for>"{%"\s*"endfor"\s*"%}"				%{ 
											this.popState();   
											yy.endFor();
											return 'FOR_END';
										%}
"{%"\s*"if"\s+(.+)\s*"%}"				%{ 
											this.begin('if');  
											yy.startIf(yy_.matches[1]);
											return 'IF_START'; 
										%}
<if>"{%"\s*"else"\s*"%}"				%{
											yy.startElse();
											return 'ELSE_START';
										%}
<if>"{%"\s*"elif"\s+(.+)\s*"%}"			%{
											yy.startElseIf(yy_.matches[1]);
											return 'ELIF_START';
										%}
<if>"{%"\s*"endif"\s*"%}"				%{
											this.popState(); 
											yy.endIf();
											return 'IF_END';
										%}
"{%"\s*"set"\s+(\w+)\s*"="\s*(.*)\s*"%}"		%{
											yy.setVariable(yy_.matches[1], yy_.matches[2]);
											return 'SET';
										%}
"{{"(.+)"}}"							%{
											yy.expr(yy_.matches[1]);
											return 'EXPR';
										%}
"{#"(.|\n)*?"#}"						return 'COMMENT'  /* J2 comment */
(.|\n)									%{
											yy.addChar(yytext);
											return 'TEXT';
										%}
<<EOF>>									return 'EOF'


/lex

%start template

%% /* language grammar */

template
 : contents EOF
     {return $1;}
 ;

contents
 : content
	{$$ = $1;}
 | contents content
	{$$ =  $1 + $2;}
 ;

content
	: FOR
	| IF
	| EXPR
	| SET
	| COMMENT
	| TEXT
 ;
FOR
	: FOR_START contents FOR_END
 ;

IF
	: IF_START contents IF_BODY
 ;
IF_BODY
	: IF_END
	| ELSE_START contents IF_BODY
	| ELIF_START contents IF_BODY
 ;
%%
