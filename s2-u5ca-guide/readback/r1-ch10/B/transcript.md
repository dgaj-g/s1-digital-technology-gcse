# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 10. Work out the group
Under the title: Three scores become one group, worked out by a piece of code you name yourself.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what you need first

### Screen ch10#1-1. Check the parts this chapter needs
This chapter uses work from earlier chapters. This screen checks that it is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Is the data entry Load event done, so the group panel switches on after the test?
    How: Run the program. Take the quiz and the test. Look at the group panel.
    If not: Go to chapter 8.  [button: Go there ›]
  [tick box] Does the group panel have a result box and a Calculate button?
    How: Open frmDataEntry in the Design tab. Look inside the group panel.
    If not: Go to chapter 2, stage 3.  [button: Go there ›]
  [tick box] Does Global.cs have assignedGroup?
    How: Double-click Global.cs in Solution Explorer.
    If not: Go to chapter 3, stage 3.  [button: Go there ›]
  [tick box] Is YOUR task sheet open at the page with the bands and the group names?
    How: Find the page that says which scores give which group.
    If not: Ask your teacher for the task sheet.  [button: Go there ›]
[Big button at the foot: I have all these ✓]

## Stage 2. Your own piece of code, with a name you choose

### Screen ch10#2-1. A machine of your own
Until now, each method came from double-clicking a button. This one you write by hand.
You choose its name. That makes it a user-defined method.
Two new words in this chapter. Click a marked word to see what it means.
  method = A named piece of code that runs when it is asked to.
  user-defined method = A method you write and name yourself.
[Animated picture: Three numbers, 3, 2 and 3, drop into a box called CalculateGroup. The word Advanced comes out.]  Caption: Three bands go in. One group comes out.
Watch out The button code on stage 3 works out the three bands. Then it asks CalculateGroup for the group.
[Big button at the foot: Next ›]

### Screen ch10#2-2. Type the first line, the total and the first group
Scroll to the bottom of frmDataEntry's code. Click the empty line above the last two curly brackets.
[CODE CARD. Type this. CalculateGroup, part 1 of 2]
  Where: above the last two curly brackets of frmDataEntry's code
  private string CalculateGroup(int first, int second, int third)
  {
      int total = first + second + third;
  
      if (total <= 4)
      {
          return "Weak";
      }
  [Lines 1 to 2] The first line, typed by you: private means only this form uses it. string means it hands back words. Then its name and three whole numbers coming in.
  [Lines 3 to 4] Add them up: The three numbers are added into total. Then an empty line.
  [Lines 5 to 8] Four or less is Weak: If the total is 4 or less, return hands back the word Weak.
  MY bands and group names come from MY task. Use the numbers and names on YOUR task sheet.
  [Names in this code: CalculateGroup, first, second, third, total]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Watch out No double-click makes this first line. Type every word of it yourself.
[Big button at the foot: I've done this ✓]

### Screen ch10#2-3. Hand back the other two groups
Each return hands the answer back to the code that asked for it.
[CODE CARD. Type this. CalculateGroup, part 2 of 2]
  Where: under part 1, inside CalculateGroup
      else if (total <= 7)
      {
          return "Intermediate";
      }
      else
      {
          return "Advanced";
      }
  
  }
  [Lines 9 to 12] Seven or less is Intermediate: Otherwise, if the total is 7 or less, hand back Intermediate.
  [Lines 13 to 16] Anything more is Advanced: Every other total hands back Advanced.
  [Lines 17 to 18] Close it: An empty line, then the curly bracket that ends CalculateGroup.
  MY numbers are 4 and 7, and MY groups are Weak, Intermediate and Advanced. Type the ones on YOUR task sheet.
  [Names in this code: total]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
[Big button at the foot: I've done this ✓]

## Stage 3. The Calculate button

### Screen ch10#3-1. Stop if anything is not done yet
In the Design tab, double-click the Calculate button in the group panel.
[CODE CARD. Type this. The Calculate button, part 1 of 7]
  Where: between the curly brackets of btnCalculateSwimmingGroup_Click
  [grey, already there] private void btnCalculateSwimmingGroup_Click(object sender, EventArgs e)
  [grey, already there] {
      if (Global.quizTaken == false || Global.reactionTestTaken == false || Global.averageCalculated == false || pnlPupilDetails.Enabled == true)
  
      {
          MessageBox.Show("Not all values have been saved");
          return;
      }
  
      //The maximum score that can be achieved for the Quiz is 5
      //The maximum score that can be achieved for the Reaction Test is 8
      //There are three score categories; 1,2, and 3 (basic, good and excellent)
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 8] Not everything done? Stop here: If any of the four is not done, a message shows. Then the code stops.
  [Lines 9 to 12] Notes for you: An empty line, then three notes about the scores. They do not run.
  [Names in this code: Global.quizTaken, Global.reactionTestTaken, Global.averageCalculated, pnlPupilDetails]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlPupilDetails and picking it from the list]
Watch out Line 3 is one long line. Keep it on one line in Visual Studio.
[Big button at the foot: I've done this ✓]

### Screen ch10#3-2. Make room for three bands
A band is 1, 2 or 3. Each score gets a band on the next screens.
[CODE CARD. Type this. The Calculate button, part 2 of 7]
  Where: under part 1, inside btnCalculateSwimmingGroup_Click
  
  
      else
      {
          int quizCategory = 0;
          int reactionTestCategory = 0;
          int swimLengthsCategory = 0;
  
          //deciding the quiz category
  [Lines 13 to 16] Otherwise, carry on: Two empty lines, then else and its curly bracket.
  [Lines 17 to 19] Three bands to fill: One whole number for each band. Each starts at 0.
  [Lines 20 to 21] A note for the quiz: An empty line, then a note. The quiz band comes next.
  [Names in this code: quizCategory, reactionTestCategory, swimLengthsCategory]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
[Big button at the foot: I've done this ✓]

### Screen ch10#3-3. Give the quiz score a band
The same shape of question as in CalculateGroup. This time each answer is a band.
[CODE CARD. Type this. The Calculate button, part 3 of 7]
  Where: under part 2, inside btnCalculateSwimmingGroup_Click
          if (Global.quizScore <= 1)
          {
              quizCategory = 1;
          }
          else if (Global.quizScore <= 3)
          {
              quizCategory = 2;
          }
          else
          {
              quizCategory = 3;
          }
  [Lines 22 to 25] One or less is band 1: If the quiz score is 1 or less, the quiz band is 1.
  [Lines 26 to 29] Three or less is band 2: Otherwise, if it is 3 or less, the quiz band is 2.
  [Lines 30 to 33] Anything more is band 3: Every other score makes the quiz band 3.
  MY quiz is out of 5, so MY numbers are 1 and 3. YOUR task sheet gives YOURS.
  [Names in this code: Global.quizScore, quizCategory]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
[Big button at the foot: I've done this ✓]

### Screen ch10#3-4. Give the test score a band
The test band has the same shape. This screen does bands 1 and 2.
[CODE CARD. Type this. The Calculate button, part 4 of 7]
  Where: under part 3, inside btnCalculateSwimmingGroup_Click
  
          //deciding the reaction test category
          if (Global.reactionTestScore <= 1)
          {
              reactionTestCategory = 1;
          }
          else if (Global.reactionTestScore <= 4)
          {
              reactionTestCategory = 2;
          }
  [Lines 34 to 35] A note for the test: An empty line, then a note.
  [Lines 36 to 39] One or less is band 1: If the test score is 1 or less, the test band is 1.
  [Lines 40 to 43] Four or less is band 2: Otherwise, if it is 4 or less, the test band is 2.
  MY numbers are 1 and 4. Use the numbers on YOUR task sheet.
  [Names in this code: Global.reactionTestScore, reactionTestCategory]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
[Big button at the foot: I've done this ✓]

### Screen ch10#3-5. The last test band
The last part of the test band, then a note for the average.
[CODE CARD. Type this. The Calculate button, part 5 of 7]
  Where: under part 4, inside btnCalculateSwimmingGroup_Click
          else
          {
              reactionTestCategory = 3;
  
          }
  
          //deciding the swim lengths category
  [Lines 44 to 48] Anything more is band 3: Every other score makes the test band 3. An empty line sits inside.
  [Lines 49 to 50] A note for the average: An empty line, then a note. The average band comes next.
  [Names in this code: reactionTestCategory]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
[Big button at the foot: I've done this ✓]

### Screen ch10#3-6. Give the average a band
Look closely at the first line. It says less than 4, not 4 or less.
[CODE CARD. Type this. The Calculate button, part 6 of 7]
  Where: under part 5, inside btnCalculateSwimmingGroup_Click
          if (Global.average < 4)
          {
              swimLengthsCategory = 1;
          }
          else if (Global.average <= 7)
          {
              swimLengthsCategory = 2;
          }
          else
          {
              swimLengthsCategory = 3;
          }
  [Lines 51 to 54] Under 4 is band 1: If the average is less than 4, the average band is 1.
  [Lines 55 to 58] Seven or less is band 2: Otherwise, if it is 7 or less, the average band is 2.
  [Lines 59 to 62] Anything more is band 3: Every other average makes the band 3.
  MY numbers are 4 and 7. Use the numbers on YOUR task sheet.
  [Names in this code: Global.average, swimLengthsCategory]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
[Big button at the foot: I've done this ✓]

### Screen ch10#3-7. Ask for the group and grey out the panel
[Animated diagram of frmDataEntry. Panels switched on: pnlSwimmingGroup.]
  Caption: The group panel goes grey. Save comes next.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
[CODE CARD. Type this. The Calculate button, part 7 of 7]
  Where: under part 6, inside btnCalculateSwimmingGroup_Click
  
          tbxSwimmingGroup.Text = CalculateGroup(reactionTestCategory, swimLengthsCategory, quizCategory);
          Global.assignedGroup = tbxSwimmingGroup.Text;
          pnlSwimmingGroup.Enabled = false;
      }
  
  
  [grey, already there] }
  [Lines 63 to 64] Ask CalculateGroup: The three bands go in. The group comes out into the box.
  [Lines 65 to 66] Remember it, grey the panel: Global.cs keeps the group. The group panel switches off.
  [Lines 67 to 69] Close the else: The end of else, then two empty lines.
  [Line 70] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: tbxSwimmingGroup, CalculateGroup, reactionTestCategory, swimLengthsCategory, quizCategory, Global.assignedGroup, pnlSwimmingGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of CalculateGroup and picking it from the list]
[Big button at the foot: I've done this ✓]

## Stage 4. Try it

### Screen ch10#4-1. Try your Calculate button
Run your program. Log in, enter the details, the attempts, the quiz and the test. Then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Click Calculate.
    How: A group appears in the box. The group panel goes grey.
    If not: Look at screen 3-7.  [button: Go there ›]
  [tick box] Must happen. Run again. Get quiz 5, test 6 and an average of 8. Click Calculate.
    How: MY bands give Advanced. YOURS give YOUR top group.
    If not: Look at screens 3-3 to 3-6.  [button: Go there ›]
  [tick box] Must happen. Run again. Get quiz 1, test 1 and an average of 2. Click Calculate.
    How: MY bands give Weak. YOURS give YOUR lowest group.
    If not: Look at screens 2-2 and 2-3.  [button: Go there ›]
  [tick box] Must NOT happen. After the group appears, click Calculate again.
    How: Nothing must happen, because the panel is grey.
    If not: If something happens, look at screen 3-7.  [button: Go there ›]
[Big button at the foot: Chapter 10 is done ✓]
