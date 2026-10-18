# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 13. Help buttons on every form
Under the title: A question-mark button on each panel that says what to do.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what you need first

### Screen ch13#1-1. Check the parts this chapter needs
This chapter uses work from earlier chapters. This screen checks that it is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Does every panel on frmDataEntry have a ? button, with a name that starts btnHelp?
    How: Open frmDataEntry in the Design tab. Click each ? button and look at its Name.
    If not: Go to chapter 2, stage 3.  [button: Go there ›]
  [tick box] Does the login form have a ? button?
    How: Open frmLogin in the Design tab. Look for the ? button.
    If not: Go to chapter 1, stage 2.  [button: Go there ›]
  [tick box] Does the quiz form have a ? button in its score panel?
    How: Open frmQuiz in the Design tab. Look inside the score panel.
    If not: Go to chapter 6, stage 2.  [button: Go there ›]
  [tick box] Does the reaction test form have a ? button?
    How: Open frmTest in the Design tab. Look inside the score panel.
    If not: Go to chapter 9, stage 3.  [button: Go there ›]
[Big button at the foot: I have all these ✓]

## Stage 2. One help button

### Screen ch13#2-1. Make the pupil details ? button speak
In the Design tab, double-click the ? button in the pupil details panel. Its click code opens in the code tab.
[CODE CARD. Type this. The pupil details help button]
  Where: between the curly brackets of btnHelpPupilDetails_Click
  [grey, already there] private void btnHelpPupilDetails_Click(object sender, EventArgs e)
  [grey, already there] {
      //displays help message if required by user
      MessageBox.Show("Please enter ALL required details");
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
  [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
Watch out Say what to DO, not what went wrong. Please enter ALL required details tells the pupil the next step.
Yours will be different MY message is Please enter ALL required details. Write YOUR message for YOUR panel, in one line.
[Big button at the foot: I've done this ✓]

## Stage 3. The rest of the help buttons

### Screen ch13#3-1. The other four on the data entry form
Each one has the same shape as the last screen. Only the button and the words change. Do one, then open the next box below.
[Names strip: btnHelpSwimLengths, btnHelpQuizResult, btnHelpReactionTest, btnHelpSwimmingGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
In the Design tab, double-click the ? button in the attempts panel.
[CODE CARD. Type this. The attempts help button]
  Where: between the curly brackets of btnHelpSwimLengths_Click
  [grey, already there] private void btnHelpSwimLengths_Click(object sender, EventArgs e)
  [grey, already there] {
      //displays help message if required by user
      MessageBox.Show("Please select 'calculate average' to work out the average number of swim lengths");
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
  [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
[Fold-out box, closed until clicked: The quiz panel's ? button]
  In the Design tab, double-click the ? button in the quiz panel.
  [CODE CARD. Type this. The quiz panel help button]
    Where: between the curly brackets of btnHelpQuizResult_Click
    [grey, already there] private void btnHelpQuizResult_Click(object sender, EventArgs e)
    [grey, already there] {
        //displays help message if required by user
        MessageBox.Show("Select 'Take quiz' option to take quiz");
    [grey, already there] }
    [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
    [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
    [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
[Fold-out box, closed until clicked: The test panel's ? button]
  In the Design tab, double-click the ? button in the test panel.
  [CODE CARD. Type this. The test panel help button]
    Where: between the curly brackets of btnHelpReactionTest_Click
    [grey, already there] private void btnHelpReactionTest_Click(object sender, EventArgs e)
    [grey, already there] {
        //displays help message if required by user
        MessageBox.Show("Select 'Take test' option to take reaction test");
    [grey, already there] }
    [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
    [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
    [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
[Fold-out box, closed until clicked: The group panel's ? button]
  In the Design tab, double-click the ? button in the group panel.
  [CODE CARD. Type this. The group panel help button]
    Where: between the curly brackets of btnHelpSwimmingGroup_Click
    [grey, already there] private void btnHelpSwimmingGroup_Click(object sender, EventArgs e)
    [grey, already there] {
        //displays help message if required by user
        MessageBox.Show("Please select 'calculate swimming group' option to see your swimming group");
    [grey, already there] }
    [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
    [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
    [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
Yours will be different Write YOUR messages for YOUR panels, one line each. Each one says what to do in that panel.
[Big button at the foot: I've done this ✓]

### Screen ch13#3-2. The login, quiz and test forms
Same shape again, on three other forms. Open each form in the Design tab first.
[Names strip: btnHelp1, btnHelpQuizScore, btnHelpReactionTest]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Open frmLogin in the Design tab. Double-click its ? button.
[CODE CARD. Type this. The login help button]
  Where: between the curly brackets of btnHelp1_Click
  [grey, already there] private void btnHelp1_Click(object sender, EventArgs e)
  [grey, already there] {
      //displays help message if required by user
      MessageBox.Show("Please enter your username and password");
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
  [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
[Fold-out box, closed until clicked: The quiz form's ? button]
  Open frmQuiz in the Design tab. Double-click the ? button in the score panel.
  [CODE CARD. Type this. The quiz form help button]
    Where: between the curly brackets of btnHelpQuizScore_Click
    [grey, already there] private void btnHelpQuizScore_Click(object sender, EventArgs e)
    [grey, already there] {
        //displays help message if required by user
        MessageBox.Show("Please complete the quiz question by question");
    [grey, already there] }
    [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
    [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
    [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
[Fold-out box, closed until clicked: The test form's ? button]
  Open frmTest in the Design tab. Double-click its ? button.
  [CODE CARD. Type this. The test form help button]
    Where: between the curly brackets of btnHelpReactionTest_Click
    [grey, already there] private void btnHelpReactionTest_Click(object sender, EventArgs e)
    [grey, already there] {
        //displays help message if required by the user
        MessageBox.Show("Read instructions and complete the reaction test");
    [grey, already there] }
    [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
    [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
    [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
Watch out frmDataEntry and frmTest both have a btnHelpReactionTest. Each form keeps its own code, so the two do not clash.
Yours will be different Write YOUR messages for YOUR forms, one line each.
[Big button at the foot: I've done this ✓]

### Screen ch13#3-3. Try every help button
Run your program. Then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. On the login form, click ?.
    How: YOUR login message shows. Click OK to close it.
    If not: Look at screen 3-2.  [button: Go there ›]
  [tick box] Must happen. Log in. Click the ? in the pupil details panel.
    How: YOUR message for that panel shows.
    If not: Look at screen 2-1.  [button: Go there ›]
  [tick box] Must happen. Work through the panels. Click each ? while its panel is on.
    How: Each panel shows its own message.
    If not: Look at screen 3-1.  [button: Go there ›]
  [tick box] Must happen. Take the quiz and the test. Click the ? on each form.
    How: Each form shows its own message.
    If not: Look at screen 3-2.  [button: Go there ›]
  [tick box] Must NOT happen. Click the ? inside a grey panel.
    How: Nothing must happen, because the whole panel is switched off.
    If not: If a message shows, look at chapter 2, stage 3.  [button: Go there ›]
[Big button at the foot: Chapter 13 is done ✓]
