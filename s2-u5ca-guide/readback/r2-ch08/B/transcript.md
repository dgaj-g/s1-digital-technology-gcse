# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 8. The data entry form: its Load event
Under the title: When the form opens, read Global.cs and switch on the right panel.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what you need first

## Stage 2. The problem and the plan

### Screen ch08#2-1. Why the form must read Global.cs as it opens
The Take quiz button closes the data entry form. The Return button on the quiz opens a new one.
[Animated picture: A brand new empty data entry form on the left. Global.cs on the right still holds the quiz score.]  Caption: The new data entry form is empty. Global.cs still holds everything.
Every time the data entry form opens, it is brand new. Nothing typed before is in it.
Global.cs still has it all. So the form must ask Global.cs, the moment it opens.
Code that runs the moment a form opens is a Load event. You met one in chapter 7.
[Big button at the foot: Next ›]

## Stage 3. Switch everything off first

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
  [Lines 13 to 17] Yes: show the score and move on: Black writing, the score turned into words by .ToString(), Take quiz hidden, the reaction test on.
  [Names in this code: Global.quizTaken, lblQuizStatus, Global.quizScore, btnTakeQuiz, pnlReactionTest]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of lblQuizStatus and picking it from the list]
Watch out The curly bracket of the if stays open here. Part 3 closes it.
[Big button at the foot: I've done this ✓]

### Screen ch08#4-3. Switch on the details panel when the quiz is not taken
else means otherwise. Here it runs when the quiz has not been taken yet.
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
  [Lines 30 to 35] Switch on the details: The details panel switches on. Red writing says Quiz not taken yet. Take quiz shows.
  [Names in this code: pnlPupilDetails, lblQuizStatus, btnTakeQuiz]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlPupilDetails and picking it from the list]
[Big button at the foot: I've done this ✓]

### Screen ch08#4-5. Switch on the group panel when the test is taken
[Animated diagram of frmDataEntry. Panels switched on: pnlReactionTest. Then pnlSwimmingGroup switches on.]
  Caption: The test panel switches off. The group panel switches on.
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
  [Lines 46 to 52] Question 3: is the test taken?: If yes, the score shows and the group panel switches on. btnTakeTest is red until chapter 9.
  [Lines 53 to 54] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Names in this code: Global.reactionTestTaken, lblTestStatus, Global.reactionTestScore, btnTakeTest, pnlReactionTest, pnlSwimmingGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of lblTestStatus and picking it from the list]
[Big button at the foot: I've done this ✓]

## Stage 5. Try your Load event

### Screen ch08#5-1. Try the data entry form before and after the quiz
Run your program and log in. Then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Look at the data entry form as it opens.
    How: Only the details panel can be clicked. The quiz status says Quiz not taken yet in red.
    If not: Look at part 4 on screen 4-3.  [button: Go there ›]
  [tick box] Must happen. Fill in the details and press Enter. Take the quiz and press Return.
    How: The details are back in their boxes. The score shows in black.
    If not: Look at parts 2 and 3 on screens 4-1 and 4-2.  [button: Go there ›]
  [tick box] Must happen. After the quiz, try the reaction test panel.
    How: The reaction test panel can be clicked.
    If not: Look at part 2 on screen 4-1.  [button: Go there ›]
  [tick box] Must NOT happen. After the quiz, look for the Take quiz button.
    How: It must NOT be there.
    If not: If it is there, look at part 2 on screen 4-1.  [button: Go there ›]
[Big button at the foot: Chapter 8 is done ✓]
