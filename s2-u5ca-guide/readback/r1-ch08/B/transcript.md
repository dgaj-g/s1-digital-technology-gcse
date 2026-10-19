# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 8. The data entry form: its Load event
Under the title: When the form opens, read Global.cs and switch on the right panel.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what you need first

### Screen ch08#1-1. Check the parts this chapter needs
This chapter uses work from earlier chapters. This screen checks that it is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Does your Enter button have its code from chapter 4?
    How: Double-click the Enter button in the Design tab. Look between its curly brackets.
    If not: Go to chapter 4.  [button: Go there ›]
  [tick box] Does your average button have its code from chapter 5?
    How: Double-click the average button in the Design tab.
    If not: Go to chapter 5.  [button: Go there ›]
  [tick box] Does the Return button on the quiz set Global.quizTaken to true?
    How: Open frmQuiz. Double-click the Return button. Look for quizTaken.
    If not: Go to chapter 7, stage 5.  [button: Go there ›]
  [tick box] Does Global.cs have quizTaken, averageCalculated and reactionTestTaken?
    How: Double-click Global.cs in Solution Explorer.
    If not: Go to chapter 3, stage 3.  [button: Go there ›]
[Big button at the foot: I have all these ✓]

## Stage 2. The problem and the plan

### Screen ch08#2-1. The form forgets, Global.cs remembers
The Take quiz button closes the data entry form. The Return button on the quiz opens a new one.
[Animated picture: A brand new empty data entry form on the left. Global.cs on the right still holds the quiz score.]  Caption: The new data entry form is empty. Global.cs still holds everything.
Every time the data entry form opens, it is brand new. Nothing typed before is in it.
Global.cs still has it all. So the form must ask Global.cs, the moment it opens.
Code that runs the moment a form opens is a Load event. You met one in chapter 7.
[Big button at the foot: Next ›]

### Screen ch08#2-2. Plan the Load event and make it
The Load event does three jobs, in this order.
First, it switches all five panels off. Second, it asks Global.cs three questions.
Third, from the answers, it fills the boxes and switches on the right panel.
STEP 1. In Solution Explorer, double-click frmDataEntry. It opens in the Design tab.
  You should see: You can see the data entry form with its panels.
STEP 2. Double-click the form's title bar at the top of the form.
  You should see: The code tab opens. Visual Studio has written frmDataEntry_Load for you.
  If it goes wrong I got a panel's code or a button's code instead. -> You double-clicked a control, not the form. Go back and double-click the form's title bar.
Watch out Double-click the title bar, not a panel. A panel gives you the wrong code.
[Big button at the foot: I've done this ✓]

## Stage 3. Switch everything off first

### Screen ch08#3-1. Switch off all five panels
Start with every panel switched off. The questions on the next screens switch on the right one.
[Animated diagram of frmDataEntry. Panels switched on: .]
  Caption: All five panels are switched off. Nothing can be clicked yet.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
[CODE CARD. Type this. The Load event, part 1 of 6]
  Where: between the curly brackets of frmDataEntry_Load
  [grey, already there] private void frmDataEntry_Load(object sender, EventArgs e)
  [grey, already there] {
      //When the form loads, all panels will initially be disabled
      pnlReactionTest.Enabled = false;
      pnlPupilDetails.Enabled = false;
      pnlQuizResult.Enabled = false;
      pnlSwimmingGroup.Enabled = false;
      pnlSwimLengths.Enabled = false;
  
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 9] Switch off all five panels: A note for you. Then each of the five panels is switched off.
  [Names in this code: pnlReactionTest, pnlPupilDetails, pnlQuizResult, pnlSwimmingGroup, pnlSwimLengths]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlReactionTest and picking it from the list]
Watch out Type pnl and the list shows all five panels. Pick each one in turn.
[Big button at the foot: I've done this ✓]

## Stage 4. Three questions for Global.cs

### Screen ch08#4-1. Show the score when the quiz has been taken
Question 1 for Global.cs: has the quiz been taken? If yes, show the score.
Two new things in this chapter. Click any marked word to see what it means.
  ForeColor = The colour of the writing on a control.
  Visible = false = Hide it. It is still there, but nobody can see it.
ForeColor is the colour of the writing. Visible = false hides the Take quiz button.
[CODE CARD. Type this. The Load event, part 2 of 6]
  Where: under part 1, inside frmDataEntry_Load
      if (Global.quizTaken == true)
      {
          //populate the student details
          lblQuizStatus.ForeColor = Color.Black;
          lblQuizStatus.Text = Global.quizScore.ToString();
          btnTakeQuiz.Visible = false;
          pnlReactionTest.Enabled = true;
  
  [Lines 10 to 12] Has the quiz been taken?: If quizTaken is true, a note for you, then the yes lines run.
  [Lines 13 to 17] Yes: show the score and move on: Black writing, the score as words, Take quiz hidden, the reaction test switched on.
  [Names in this code: Global.quizTaken, lblQuizStatus, Global.quizScore, btnTakeQuiz, pnlReactionTest]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of lblQuizStatus and picking it from the list]
[Big button at the foot: I've done this ✓]

### Screen ch08#4-2. Put the pupil's details back in their boxes
Still inside the yes part. The pupil's details come back from Global.cs into their boxes.
[CODE CARD. Type this. The Load event, part 3 of 6]
  Where: under part 2, inside frmDataEntry_Load
          //Repopulates the student details
          tbxSurname.Text = Global.surname;
          tbxFirstName.Text = Global.firstname;
          cbxGender.Text = Global.gender;
          cbxYeargroup.Text = Global.yearGroup;
  
  
  
      }
  [Lines 18 to 22] Put the details back: A note, then each box gets its detail back from Global.cs.
  [Lines 23 to 26] The end of the yes part: Three empty lines, then the curly bracket that ends the yes part.
  [Names in this code: tbxSurname, Global.surname, tbxFirstName, Global.firstname, cbxGender, Global.gender, cbxYeargroup, Global.yearGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of Global.surname and picking it from the list]
Watch out These four lines are the Enter button's lines, the other way round. The box is on the left now.
[Big button at the foot: I've done this ✓]

### Screen ch08#4-3. Start from the details when the quiz is not taken
If the quiz has not been taken, this pupil is new. So the details panel switches on.
[Animated diagram of frmDataEntry. Panels switched on: . Then pnlPupilDetails switches on.]
  Caption: Only the details panel switches on. The other four stay switched off.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
[CODE CARD. Type this. The Load event, part 4 of 6]
  Where: under part 3, inside frmDataEntry_Load
      else
      {
          //enable the details panel so that pupil details can be added
          pnlPupilDetails.Enabled = true;
          lblQuizStatus.ForeColor = Color.Red;
          lblQuizStatus.Text = "Quiz not taken yet";
          btnTakeQuiz.Visible = true;
      }
  
  [Lines 27 to 29] No: a new pupil: else, then a note for you.
  [Lines 30 to 35] Start from the details: The details panel switches on. Red writing says Quiz not taken yet. Take quiz shows.
  [Names in this code: pnlPupilDetails, lblQuizStatus, btnTakeQuiz]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlPupilDetails and picking it from the list]
[Big button at the foot: I've done this ✓]

### Screen ch08#4-4. Show the attempts when the average is worked out
Question 2 for Global.cs: has the average been worked out? If yes, put the numbers back.
The numbers are kept as numbers. .ToString() turns each one into words for its box.
[CODE CARD. Type this. The Load event, part 5 of 6]
  Where: under part 4, inside frmDataEntry_Load
      if (Global.averageCalculated == true)
      {
          tbxAttempt1.Text = Global.attempt1.ToString();
          tbxAttempt2.Text = Global.attempt2.ToString();
          tbxAttempt3.Text = Global.attempt3.ToString();
          tbxCalculateAverage.Text = Global.average.ToString();
          btnCalculateAverage.Visible = false;
          pnlSwimLengths.Enabled = false;
      }
  
  [Lines 36 to 37] Is the average worked out?: If averageCalculated is true, the yes lines run.
  [Lines 38 to 41] Put the numbers back: The three attempts and the average go back in their boxes.
  [Lines 42 to 45] Hide the button, keep it switched off: The average button hides. The attempts panel stays switched off.
  [Names in this code: Global.averageCalculated, tbxAttempt1, Global.attempt1, tbxCalculateAverage, Global.average, btnCalculateAverage, pnlSwimLengths]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxAttempt1 and picking it from the list]
Watch out This question has no else. If the average is not worked out, nothing happens here.
[Big button at the foot: I've done this ✓]

### Screen ch08#4-5. Switch on the group panel when the test is taken
Question 3 for Global.cs: has the reaction test been taken? If yes, move on to the group.
[Animated diagram of frmDataEntry. Panels switched on: pnlReactionTest. Then pnlSwimmingGroup switches on.]
  Caption first: The quiz and the reaction test are both taken.
  Caption: The reaction test panel switches off. The group panel switches on.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
[CODE CARD. Type this. The Load event, part 6 of 6]
  Where: under part 5, inside frmDataEntry_Load
      if (Global.reactionTestTaken == true)
      {
          lblTestStatus.Text = Global.reactionTestScore.ToString();
          btnTakeTest.Visible = false;
          pnlReactionTest.Enabled = false;
          pnlSwimmingGroup.Enabled = true;
      }
  [grey, already there] 
  [grey, already there] }
  [Lines 46 to 52] Is the test taken? Yes: move on: The score shows. Take test hides. The test panel switches off. The group panel switches on.
  [Lines 53 to 54] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Names in this code: Global.reactionTestTaken, lblTestStatus, Global.reactionTestScore, btnTakeTest, pnlReactionTest, pnlSwimmingGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of lblTestStatus and picking it from the list]
The reaction test is made in chapter 9. Until then, btnTakeTest may have a red line under it.
[Big button at the foot: I've done this ✓]

## Stage 5. Try your Load event

### Screen ch08#5-1. Try the data entry form before and after the quiz
Run your program and log in. Then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Look at the data entry form as it opens.
    How: Only the details panel can be clicked. The quiz status says Quiz not taken yet in red.
    If not: Look at part 4 on screen 4-3.  [button: Go there ›]
  [tick box] Must happen. Fill in the details and the attempts. Take the quiz and press Return.
    How: The details are back in their boxes. The score shows in black.
    If not: Look at parts 2 and 3 on screens 4-1 and 4-2.  [button: Go there ›]
  [tick box] Must happen. After the quiz, try the reaction test panel.
    How: The reaction test panel can be clicked.
    If not: Look at part 2 on screen 4-1.  [button: Go there ›]
  [tick box] Must NOT happen. After the quiz, look for the Take quiz button.
    How: It must NOT be there.
    If not: If it is there, look at part 2 on screen 4-1.  [button: Go there ›]
[Big button at the foot: Chapter 8 is done ✓]
