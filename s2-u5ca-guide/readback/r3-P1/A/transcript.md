# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 0. Start here: how to use this guide
Under the title: What you are making, how a chapter works, and the three rules.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 3. What you are making
Banner at the top of every screen in this part: "Part 1 of 3. You are learning your whole program"

### Screen ch00#1-0. See what your program is, before you make it
[Opening screen of this part, one card]
Your program is five forms joined by buttons, plus one text file. This part shows the whole thing, then where it lives in Visual Studio.
When you have read it, you know the five forms and how to run them.
[Big button at the foot: Next ›]

### Screen ch00#1-1. Meet the four words you will see a lot
This guide helps you create your Unit 5 program, one part at a time.
Click any marked word to see what it means.
  form = One of the pages of your program. The login is a form. The quiz is a form.
  control = Anything you put on a form: a button, a text box, a panel, a label.
  property = A setting of a control, like its Name or its Text. The Properties window lists them.
  IntelliSense = The list that pops up as you type code. It knows every name in your program.
Line above the big button: Done when you have read the four words
[Big button at the foot: Next ›]

### Screen ch00#1-2. See the five forms and the one file
Here is the whole program, five forms and one file.
[Animated picture: Five cards: Login, Data entry, Quiz, Reaction test and Report, joined by arrows, with a note card for the file pupilStats.txt.]  Caption: Each card is one form, and the arrows are the buttons between them.
You have made some of these already, and the home page shows which parts are done.
Watch out Every form has a name that starts with frm. You will see those names in the code.
Line above the big button: Done when you have looked at the picture and read the line under it
[Big button at the foot: Next ›]

### Screen ch00#1-3. See where your forms and your code live
Everything in your project is listed in Solution Explorer, on the right of Visual Studio.
[Picture strip: Solution Explorer]
  picture 1: Solution Explorer is on the right, with every form and Global.cs listed.
  picture 2: Double-click a form for its Design tab. Right-click it for View Code.
Each form has two tabs. The Design tab shows the form. The code tab shows the code behind it.
Double-click a button in the Design tab and the code tab opens at that button's code.
Watch out Closing a tab deletes nothing. Double-click the form in Solution Explorer to open it again.
Line above the big button: Done when you have found Solution Explorer and opened one form's code
[Big button at the foot: Next ›]

### Screen ch00#1-4. Start your program and stop it again
You will run your program a lot in this guide.
Here is how to start it and how to stop it.
[Picture strip: Running your program]
  picture 1: The green Start arrow at the top runs your program.
  picture 2: The arrow becomes a red Stop square. Press it to stop.
Watch out Use the green arrow and the menus, never keyboard shortcuts. In a browser tab, a shortcut can reload the page.
Line above the big button: Done when you have seen the green Start arrow and the red Stop square
[Big button at the foot: Next ›]

## Part 2 of 3. How this guide works
Banner at the top of every screen in this part: "Part 2 of 3. You are learning how this guide works"

### Screen ch00#2-0. See how a chapter works and where you are up to
[Opening screen of this part, one card]
Every chapter has the same shape. The home page shows which parts are done and which part is next.
When you have read it, you can find your next job on any day.
[Big button at the foot: Next ›]

### Screen ch00#2-1. See what a chapter looks like
This guide is split into chapters.
One chapter is one part of your program, like the login or the quiz.
[Animated picture: A small drawn chapter: a row of part pills, a list of three steps with tick boxes, and a big button at the foot.]  Caption: A chapter is a row of parts, each a few screens.
Every chapter starts by checking what you need, and ends with a Try it screen.
Line above the big button: Done when you have looked at the picture and read the lines under it
[Big button at the foot: Next ›]

### Screen ch00#2-2. Mark a screen done with the big button
Each screen says what you are making, and when it is done.
When you have done a screen, press the big button at the bottom.
It ticks the screen and moves you on to the next one.
Watch out Your ticks are saved to your school account. Next lesson, the guide opens where you left off.
Line above the big button: Done when you know what the big button at the bottom does
[Big button at the foot: Next ›]

### Screen ch00#2-3. Open the first part that is not ticked
The home page is called Where am I up to? and it lists every part in order.
Tick the parts you have already done, then open the first part that is not ticked.
If you were away, this is how you pick up where you were.
[Animated picture: One chapter card from the home page: the number, the title, a progress ring that fills as you tick, an Open button and a smaller I did this already button.]  Caption: The grey button is for a part you made before this guide.
Watch out Only press I did this already if it is true, because the guide cannot check. Your program will.
Line above the big button: Done when you know how to find your next job on the home page
[Big button at the foot: Next ›]

## Part 3 of 3. The three rules
Banner at the top of every screen in this part: "Part 3 of 3. You are learning the three rules"

### Screen ch00#3-0. Meet the three rules you keep all the way through
[Opening screen of this part, one card]
Three rules run through every chapter. My names are not your names. IntelliSense types names for you. You type every line yourself.
When you keep them, red lines are rare and your names stay your own.
[Big button at the foot: Next ›]

### Screen ch00#3-1. Meet rule 1: my names are not your names
Every control in your program has a name, like tbxSurname, and the code uses those names.
This guide shows MY example with MY names, and YOUR names may be different.
[Picture strip: Finding a control's name]
  picture 1: In the Design tab, click the control once.
  picture 2: At the top of the Properties window, the name sits beside Name.
The name is a property of the control, one of its settings.
[Names strip: tbxSurname, btnEnter, pnlPupilDetails]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Watch out When you see one of my names, read it as the name YOU gave that control.
Line above the big button: Done when you know where to find the name of any control
[Big button at the foot: Next ›]

### Screen ch00#3-2. Meet rule 2: let IntelliSense type the name
You will type a lot of names.
Visual Studio can type most of each one for you.
IntelliSense is the list that pops up as you type code. It knows every name in your program.
[IntelliSense animation: types pnl, a list drops down, pnlPupilDetails is picked]
[Picture strip: The real list in Visual Studio 2019]
  picture 1: Type the first letters of the name.
  picture 2: The list pops up with every matching name in YOUR program.
  picture 3: Press Tab. The name is typed for you, spelt right.
Watch out If a name is not in the list, your control has a different name. Check it in the Properties window.
Line above the big button: Done when you know that Tab finishes a name from the list
[Big button at the foot: Next ›]

### Screen ch00#3-3. Meet rule 3: you type every line yourself
You cannot copy code from this guide, so you type every line yourself.
Typing is how it sticks in your head.
[CODE CARD. Type this. Three lines to try, for practice only]
  Where: nowhere yet. This one is only for trying the rule.
  pnlPupilDetails.Enabled = false;
  pnlSwimLengths.Enabled = true;
  btnEnter.Visible = false;
  [Lines 1 to 3] Three lines you will meet again: Switch off one panel, switch on the next, hide a button. Each line ends with a semicolon.
  [Names in this code: pnlPupilDetails, pnlSwimLengths, btnEnter]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlPupilDetails and picking it from the list]
Watch out Read each line as you type it, so you know what it does.
Line above the big button: Done when you have read the three practice lines
[Big button at the foot: Next ›]

### Screen ch00#3-4. Try to copy a line from the guide
Go back one screen and try to copy a line from the code box there.
STEP 1. Select a line in the box, then right-click it or drag it.
  You should see: The guide says no, with a small message. You type it instead.
Line above the big button: Done when you have tried to copy a line and the guide said no
[Big button at the foot: I've done this ✓]

### Screen ch00#3-5. See what a red line means
Sometimes a line gets a red wiggly underline.
That means Visual Studio does not understand it yet.
[Picture strip: Finding an error]
  picture 1: A red wiggly line under a word.
  picture 2: The Error List at the bottom names the problem.
  picture 3: Double-click the error. The cursor jumps to the line.
Watch out Most red lines are a name spelt differently from the control. Check the name in the Properties window.
Line above the big button: Done when you know what a red wiggly line means and where the Error List is
[Big button at the foot: Next ›]

### Screen ch00#3-6. Check your program builds before you run it
Before you run, build, because building checks every line.
Build succeeded means every line is understood.
[Picture strip: Building]
  picture 1: Open the Build menu and choose Build Solution.
  picture 2: Bottom left says Build succeeded.
Watch out If the bottom left says Build failed, go back one screen and find the red line.
Line above the big button: Done when you have seen Build succeeded at the bottom left
[Big button at the foot: Chapter 0 is done ✓]

# Chapter 1. The login form
Under the title: Two boxes, one button, and the code that checks them.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 4. Check what your login form has
Banner at the top of every screen in this part: "Part 1 of 4. You are checking your login form so far"

### Screen ch01#1-1. Check what your login form already has
Your login form may be partly made already.
This screen checks what is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Open frmLogin in the Design tab. Does it have two text boxes, a Login button and two labels?
    How: Solution Explorer is on the right. Double-click frmLogin to see it in the Design tab.
    If not: Go to part 2.  [button: Go there ›]
  [tick box] Click the password box once. In Properties, is PasswordChar a star?
    How: Properties is on the right, under Solution Explorer. PasswordChar is in the list in A to Z order.
    If not: Go to part 2, screen 3.  [button: Go there ›]
  [tick box] Double-click the Login button. Is there code between its two curly brackets?
    How: The code tab opens at btnLogin_Click. Lines between the curly brackets mean yes.
    If not: Go to part 3.  [button: Go there ›]
  [tick box] Run it with the green Start arrow. Do wrong details give a message, and the right ones open the data entry form?
    How: Type a wrong password first. Then type the right username and password.
    If not: Go to part 3.  [button: Go there ›]
[Fold-out box, closed until clicked: Not sure where to look?]
  Solution Explorer is on the right of Visual Studio 2019. It lists every form. Double-click frmLogin to see it in the Design tab.
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I have all these ✓]

## Part 2 of 4. The two boxes and the button
Banner at the top of every screen in this part: "Part 2 of 4. You are making the login form's boxes and buttons"

### Screen ch01#2-0. Make the login form and its controls
[Opening screen of this part, one card]
You drag nine controls from the Toolbox onto the login form. Then you give each one its name in Properties.
When it works, the form shows a title, two labelled boxes and a Login button. The password box shows a star for every letter.
[Big button at the foot: Next ›]

### Screen ch01#2-1. Put the boxes, labels and buttons on the login form
Drag the nine controls in this table onto your login form, in order.
The Toolbox is down the left side of Visual Studio. It lists the controls you can drag.
The panel goes on first. Everything from the title down to the Login button goes inside it.
[Table of controls for frmLogin. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Panel | pnlLogin (the panel that holds the login boxes and button) | Nothing else to set
  Label | lblTitle (the title at the top of the login form) | Text = Login Form
  Label | lblUsername (the label beside the username box) | Text = Enter Username
  TextBox | tbxUsername (the box where the username is typed) | Nothing else to set
  Label | lblPassword (the label beside the password box) | Text = Enter Password
  TextBox | tbxPassword (the box where the password is typed) | Nothing else to set
  Button | btnLogin (the Login button) | Text = Login
  Label | lblSubtitle (the small line under the title) | Text = Swimming club records
  Button | btnHelp1 (the ? button on the login form) | Text = ?
  You should see: Every row from lblTitle to btnLogin sits inside the panel. lblSubtitle and the ? button sit outside it.
Watch out Drop every row from lblTitle down to btnLogin INSIDE the panel. lblSubtitle and btnHelp1 go outside it.
Line above the big button: Done when all nine controls are on your login form in the order of the table
[Big button at the foot: I've done this ✓]

### Screen ch01#2-2. Give every control its name
Every control you dragged on needs a name, so your code can find it.
[Picture strip: Give a control its name]
  picture 1: Click the control once. Little squares appear round it.
  picture 2: Find Name near the top of Properties and type the new name
  picture 3: Type the new name and press Enter.
Do this for every row of the table on the screen before. Give yours the names YOU choose.
Start each name with three letters for its kind. pnl is a panel, lbl a label, tbx a text box, btn a button.
Watch out A name has no spaces. Two controls can never have the same name.
Line above the big button: Done when every control on your login form has a name of your own
[Big button at the foot: I've done this ✓]

### Screen ch01#2-3. Make the password show stars
Nobody should see a password as it is typed.
One setting in Properties turns every letter into a star.
STEP 1. In the Design tab, click the password box once.
  You should see: Little squares appear round the password box.
STEP 2. In Properties, find PasswordChar. In the box beside it, type the star sign * and press Enter.
  You should see: PasswordChar shows *.
  If it goes wrong I cannot find PasswordChar. -> The list is in A to Z order. Scroll down to the letter P.
  If it goes wrong I cannot find the star sign. -> Hold Shift and press the 8 key at the top of the keyboard.
The ? button does nothing yet. You make it work in chapter 13.
Watch out Put the star on the PASSWORD box, not the username box.
Line above the big button: Done when a letter typed in the password box shows as a star
[Big button at the foot: I've done this ✓]

## Part 3 of 4. The code behind the Login button
Banner at the top of every screen in this part: "Part 3 of 4. You are making the Login button's code"

### Screen ch01#3-0. Make the Login button check the details
[Opening screen of this part, one card]
The Login button's code asks three questions in turn. Is the username too long? Are the details right? Or is anything else wrong?
When it works, a wrong login shows a message and empties the boxes. The right login opens the data entry form.
[Big button at the foot: Next ›]

### Screen ch01#3-1. Open the code behind the Login button
The Login button's code checks what was typed, and it goes in the code tab.
Five new things in this chapter. Click any marked word to see what it means.
  .Text = The words it shows.
  .Length = How many characters.
  == = Is the same as.
  && = And.
  this.Hide() = Hide this form but keep it.
STEP 1. In the Design tab, double-click the Login button.
  You should see: The code tab opens at btnLogin_Click, empty between the curly brackets.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: From the button to its code]
    picture 1: Double-click the button in the Design tab. My picture shows a quiz button. Yours is the Login button.
    picture 2: The code tab opens. Visual Studio writes the first and last lines for you. Yours says btnLogin_Click.
Line above the big button: Done when the code tab is open at btnLogin_Click, empty between the curly brackets
[Big button at the foot: I've done this ✓]

### Screen ch01#3-2. Stop a username that is too long
First the code checks that the username is not too long.
First the code checks that the username is not too long.
.Text is what was typed in a box. .Length counts its characters. .Clear() empties a box.
[CODE CARD. Type this. The Login button: code 1 of 3]
  Where: between the curly brackets of btnLogin_Click, in frmLogin.cs
  [grey, already there] private void btnLogin_Click(object sender, EventArgs e)
  [grey, already there] {
      //checks that entered username does not exceed 15 characters
      if (tbxUsername.Text.Length > 15)
      {
          MessageBox.Show("Username has exceeded the maximum number of characters", "Please enter a username with less than 15 characters");
  
          tbxUsername.Clear();
          tbxPassword.Clear();
      }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 5] Too long?: The line with two slashes is a note for you. The computer skips it. Then it asks: is the username more than 15 letters?
  [Lines 6 to 10] Say so and empty both boxes: A message box pops up and tells the user. Then both boxes are emptied.
  [Names in this code: tbxUsername, tbxPassword]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxUsername and picking it from the list]
Watch out Leave the last curly bracket of btnLogin_Click where it is. The code on the next two screens goes above it.
Line above the big button: Done when lines 3 to 10 are typed with no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch01#3-3. Let the right username and password in
Next the code asks: are the username and the password both right?
else if means: if the first question was no, ask this one instead. == asks if two things are the same, and && means both must be true.
[CODE CARD. Type this. The Login button: code 2 of 3]
  Where: under part 1, inside btnLogin_Click, in frmLogin.cs
  
      //if username 'jsmith' and password 'Password1' inputted, message appears, 'Login Details Correct'
      else if (tbxUsername.Text == "jsmith" && tbxPassword.Text == "Password1")
      {
          MessageBox.Show("Login details correct");
          this.Hide();
          new frmDataEntry().Show();
      }
  [Lines 11 to 14] The right details?: A note, then the question. Is the username jsmith AND is the password Password1?
  [Lines 15 to 18] Let them in: A message box says so. The login form hides. A new data entry form opens.
  MY username is jsmith and MY password is Password1. YOURS are the ones YOUR task sheet gives you.
  [Names in this code: tbxUsername, tbxPassword, frmDataEntry]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxPassword and picking it from the list]
this.Hide() hides the login form, and the last line opens a new data entry form. Until chapter 2 makes frmDataEntry, it has a red line under it.
Watch out Two equals signs, not one. One equals sign would try to change the box.
Line above the big button: Done when lines 11 to 18 are typed, using YOUR username and password
[Big button at the foot: I've done this ✓]

### Screen ch01#3-4. Show Login incorrect when the details are wrong
Last, the code deals with anything else.
That means a wrong username or a wrong password.
[CODE CARD. Type this. The Login button: code 3 of 3]
  Where: under part 2, inside btnLogin_Click, in frmLogin.cs
  
  
      else
      {
          //If incorrect login details are entered, 'login incorrct, login unsuccessful' message appears
          MessageBox.Show("Login incorrect", "Login Unsuccessful!");
  
          tbxUsername.Clear();
          tbxPassword.Clear();
      }
  [grey, already there] }
  [Lines 19 to 23] Anything else: else catches every other case. Then a note for you.
  [Lines 24 to 28] Say so and empty both boxes: A message box says Login incorrect. Both boxes are emptied.
  [Line 29] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: tbxUsername, tbxPassword]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxUsername and picking it from the list]
Watch out The else has no question after it. It runs when the two questions above were both false.
Line above the big button: Done when lines 19 to 28 are typed above the last curly bracket
[Big button at the foot: I've done this ✓]

## Part 4 of 4. Try your login form
Banner at the top of every screen in this part: "Part 4 of 4. You are testing your login form"

### Screen ch01#4-1. Try every way into your login form
Run your program and try each row of this table.
Tick the rows that work. A row that fails tells you where to look.
No data entry form yet? The program will not start without it. Make it in chapter 2, then come back.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Type a username of 16 letters and press Login.
    How: The message says the username has exceeded the maximum number of characters.
    If not: Look at the code on screen 3-2.  [button: Go there ›]
  [tick box] Must happen. Type the right username and a wrong password. Press Login.
    How: The message says Login incorrect. Both boxes are empty.
    If not: Look at the code on screen 3-4.  [button: Go there ›]
  [tick box] Must happen. Type the right username and password. Press Login.
    How: The login form goes and the data entry form opens.
    If not: Look at the code on screen 3-3.  [button: Go there ›]
  [tick box] Must NOT happen. Leave both boxes empty and press Login.
    How: The data entry form must NOT open. The Login incorrect message appears.
    If not: If the data entry form opened, look at the question in the code on screen 3-3.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: Chapter 1 is done ✓]

# Chapter 2. The data entry form: its panels and boxes
Under the title: Five panels, two buttons, and a name on every control.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 4. Check what your data entry form has
Banner at the top of every screen in this part: "Part 1 of 4. You are checking your data entry form so far"

### Screen ch02#1-1. Check what your data entry form already has
Your data entry form may be partly made already.
This screen checks what is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Open frmDataEntry in the Design tab. Does it have five panels?
    How: They hold the pupil details, three attempts, the quiz, the reaction test and the group.
    If not: Go to part 2.  [button: Go there ›]
  [tick box] Click the edge of each panel once. In Properties, does its Name start with pnl?
    How: The Name line is near the top of Properties.
    If not: Go to part 2, screen 2.  [button: Go there ›]
  [tick box] Under the panels, are there two big buttons, Save Details and View Report?
    How: They sit on the form itself, outside the five panels.
    If not: Go to part 3, screen 5.  [button: Go there ›]
  [tick box] Click the year group list once. In Properties, click Items. Are the year groups in it?
    How: Items opens a box with one choice on each line.
    If not: Go to part 3, screen 2.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I have all these ✓]

## Part 2 of 4. The five panels
Banner at the top of every screen in this part: "Part 2 of 4. You are making the five panels"

### Screen ch02#2-0. See the five panels, then make them
[Opening screen of this part, one card]
The data entry form is where a user types in one pupil. Five panels split it into five jobs.
When it works, your data entry form has five named panels. Each name starts with pnl.
[Big button at the foot: Next ›]

### Screen ch02#2-1. See the five panels on the data entry form
The data entry form is where a user types in one pupil.
It holds five panels.
[Animated map of frmDataEntry. Each panel lights up in turn, labelled with its name: pnlPupilDetails, pnlSwimLengths, pnlQuizResult, pnlReactionTest, pnlSwimmingGroup]
  Caption: Five panels: pupil details, attempts, quiz, test and group.
Each panel holds the controls for one job. The Save and View Report buttons sit under them.
Yours will be different In MY example the second panel holds three swim lengths. YOURS holds whatever YOUR task measures three times. Name the panel for what it holds.
Line above the big button: Done when you can name the five panels and say what each one holds
[Big button at the foot: Next ›]

### Screen ch02#2-2. Put on the five panels and name each one
Make the panels first.
The boxes and buttons go inside them on the next screens.
STEP 1. In Solution Explorer, double-click frmDataEntry. It opens in the Design tab.
  You should see: The data entry form, empty or partly made.
STEP 2. Drag a Panel from the Toolbox onto the form. The Toolbox is down the left side. Drag the corner to make it bigger.
  You should see: A box with a dotted edge sits on the form.
STEP 3. Click the panel's edge once. In Properties, find the word Name. Type its new name and press Enter.
  You should see: The Name line shows the new name, like pnlPupilDetails.
  If it goes wrong Clicking the middle picks the wrong thing. -> Click the dotted EDGE of the panel, not the middle.
STEP 4. Do the same for the other four panels.
  You should see: Five panels, each with a name that starts with pnl.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: Give a control its name]
    picture 1: Click the control once. Little squares appear round it.
    picture 2: In Properties, find the word Name. It is near the top of the list.
    picture 3: Type the new name and press Enter.
Watch out MY panel names are pnlPupilDetails, pnlSwimLengths, pnlQuizResult, pnlReactionTest and pnlSwimmingGroup. Name YOURS for what they hold.
Line above the big button: Done when five panels sit on your form, each named with pnl at the start
[Big button at the foot: I've done this ✓]

## Part 3 of 4. Inside each panel
Banner at the top of every screen in this part: "Part 3 of 4. You are making the boxes and buttons in each panel"

### Screen ch02#3-0. Fill each panel with its boxes and buttons
[Opening screen of this part, one card]
Each panel gets its own labels, boxes, lists and buttons. One screen does one panel, from a table.
When it works, every panel holds its controls. The two big buttons sit under the panels.
[Big button at the foot: Next ›]

### Screen ch02#3-1. Fill the pupil details panel
The first panel holds the pupil's name, gender and year group.
Drag each row INSIDE pnlPupilDetails.
A ComboBox is a drop-down list. DropDownList means the user can only pick. They cannot type their own.
[Table of controls for frmDataEntry. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Label | lblPupilDetails (the heading of the pupil details panel) | Text = Pupil Details
  Label | lblFirstName (the label beside the first name box) | Text = First Name
  TextBox | tbxFirstName (the box where the first name is typed) | Nothing else to set
  Label | lblSurname (the label beside the surname box) | Text = Surname
  TextBox | tbxSurname (the box where the surname is typed) | Nothing else to set
  Label | lblGender (the label beside the gender list) | Text = Gender
  ComboBox | cbxGender (the drop-down list for gender) | DropDownStyle = DropDownList
  Label | lblYeargroup (the label beside the year group list) | Text = Yeargroup
  ComboBox | cbxYeargroup (the drop-down list for year group) | DropDownStyle = DropDownList
  Button | btnEnter (the Enter button under the pupil details) | Text = Enter
  Button | btnHelpPupilDetails (the ? button in the pupil details panel) | Text = ?
  You should see: Two boxes, two drop-down lists, their labels and two buttons sit inside the pupil details panel.
Line above the big button: Done when every row of the table sits inside the pupil details panel
[Big button at the foot: I've done this ✓]

### Screen ch02#3-2. Put the choices in the two drop-down lists
A drop-down list is empty until you give it its choices.
They go in Items, one per line.
One new thing in this chapter. Click the marked word to see what it means.
  Items = The choices in a drop-down list, one on each line.
STEP 1. In the Design tab, click the year group list once.
  You should see: Little squares appear round the year group list.
STEP 2. In Properties, find Items. Click the three dots beside it.
  You should see: A box opens for typing the choices.
STEP 3. Type one choice on each line. Then click OK.
  You should see: Items now says Collection.
  If it goes wrong All my choices show on one line. -> Press Enter after each choice, so each one has its own line.
STEP 4. Do the same for the gender list.
  You should see: Both lists now hold their choices.
Watch out MY year group list holds 11 to 14. YOURS holds the choices YOUR task sheet gives you.
Line above the big button: Done when both drop-down lists hold their choices, one per line
[Big button at the foot: I've done this ✓]

### Screen ch02#3-3. Fill the three attempts panel
The second panel holds three attempts and their average.
Drag each row INSIDE pnlSwimLengths.
[Table of controls for frmDataEntry. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Label | lblSwimLengths (the heading of the attempts panel) | Text = Swim lengths
  Label | lblAttempt1 (the label beside attempt 1) | Text = Attempt 1
  TextBox | tbxAttempt1 (the box for attempt 1) | Nothing else to set
  Label | lblAttempt2 (the label beside attempt 2) | Text = Attempt 2
  TextBox | tbxAttempt2 (the box for attempt 2) | Nothing else to set
  Label | lblAttempt3 (the label beside attempt 3) | Text = Attempt 3
  TextBox | tbxAttempt3 (the box for attempt 3) | Nothing else to set
  Button | btnCalculateAverage (the Calculate Average button) | Text = Calculate Average
  TextBox | tbxCalculateAverage (the box that shows the average) | Nothing else to set
  Button | btnHelpSwimLengths (the ? button in the attempts panel) | Text = ?
  You should see: Three attempt boxes, the average box and two buttons sit inside the second panel.
The Calculate Average button does nothing yet. You make it work in chapter 5.
Line above the big button: Done when every row of the table sits inside the three attempts panel
[Big button at the foot: I've done this ✓]

### Screen ch02#3-4. Fill the quiz panel and the reaction test panel
These two panels look alike.
Each one has a heading, a line that says not taken yet, and two buttons.
[Table of controls for frmDataEntry. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Label | lblQuizResult (the heading of the quiz panel) | Text = Quiz Result
  Label | lblQuizStatus (the label that says whether the quiz has been taken) | Text = Quiz not taken yet
  Button | btnTakeQuiz (the Take Quiz button) | Text = Take Quiz
  Button | btnHelpQuizResult (the ? button in the quiz panel) | Text = ?
  Label | lblReactionTest (the heading of the test panel) | Text = Reaction Test
  Label | lblTestStatus (the label that says whether the test has been taken) | Text = Test not taken yet
  Button | btnTakeTest (the Take Test button) | Text = Take Test
  Button | btnHelpReactionTest (the ? button in the test panel) | Text = ?
  You should see: The first four rows sit inside pnlQuizResult. The last four sit inside pnlReactionTest.
Watch out The first four rows go in the QUIZ panel. The last four go in the TEST panel.
Line above the big button: Done when the first four rows sit in the quiz panel and the last four in the test panel
[Big button at the foot: I've done this ✓]

### Screen ch02#3-5. Fill the group panel and add the two big buttons
The first four rows go INSIDE pnlSwimmingGroup, and the rest sit on the form.
A PictureBox shows a picture. StretchImage makes the picture fill the whole box.
[Table of controls for frmDataEntry. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Label | lblSwimmingGroup (the heading of the group panel) | Text = Swimming Group
  TextBox | tbxSwimmingGroup (the box that shows the group) | Nothing else to set
  Button | btnCalculateSwimmingGroup (the button that works out the group) | Text = Calculate Swim Group
  Button | btnHelpSwimmingGroup (the ? button in the group panel) | Text = ?
  Button | btnSaveDetails (the Save Details button) | Text = Save Details
  Button | btnViewReport (the View Report button) | Text = View Report
  Label | lblTitle2 (the title at the top of the data entry form) | Text = Pupil Data Input
  PictureBox | pbxLogo3 (a picture box with a logo) | SizeMode = StretchImage
  You should see: Four rows sit inside the group panel. Two big buttons, the title and the logo sit on the form.
To put a picture in the logo, click the three dots beside Image in Properties. Then click Import, pick the logo from YOUR coursework folder and click OK.
Watch out Every ? button's name starts btnHelp. They all start working in chapter 13.
Line above the big button: Done when the group panel is filled and the two big buttons sit on the form
[Big button at the foot: I've done this ✓]

## Part 4 of 4. Try it in the Design tab
Banner at the top of every screen in this part: "Part 4 of 4. You are checking every name on the form"

### Screen ch02#4-1. Check every name on your data entry form
A wrong name stops your code finding a control later.
Click each control once and read its Name.
[List of checks: Try it]  Look at your form in the Design tab. Tick each row that is right. A row that is wrong tells you where to go.
  [tick box] Must happen. Every panel's name starts with pnl.
    How: Click the dotted edge of each panel once.
    If not: Go back to part 2, screen 2.  [button: Go there ›]
  [tick box] Must happen. Every text box's name starts with tbx.
    How: Click each white box once.
    If not: Go back to part 3.  [button: Go there ›]
  [tick box] Must happen. Every button's name starts with btn, and every drop-down list's name starts with cbx.
    How: Click each button and each list once.
    If not: Go back to part 3.  [button: Go there ›]
  [tick box] Must NOT happen. Click any control once and read its Name.
    How: It must NOT be a made-up name like textBox1 or panel3.
    If not: Give it a real name, as on part 2, screen 2.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: Chapter 2 is done ✓]
