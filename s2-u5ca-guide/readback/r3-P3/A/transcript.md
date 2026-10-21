# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 6. The quiz: the first three questions
Under the title: Get to the quiz, then mark a typed answer, two buttons and a list.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 6. Check what your quiz has
Banner at the top of every screen in this part: "Part 1 of 6. You are checking your quiz so far"

### Screen ch06#1-1. Check what your quiz already has
Your quiz may be partly made already, so this screen checks what is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Is frmQuiz in Solution Explorer? Does it hold a score panel and five question panels?
    How: Double-click frmQuiz in Solution Explorer. It opens in the Design tab.
    If not: Go to part 2.  [button: Go there ›]
  [tick box] Does question 4 have four round buttons and a Check button? Does question 5 have a number box?
    How: Click each control once. Its name shows near the top of Properties.
    If not: Go to part 2, screen 5.  [button: Go there ›]
  [tick box] Run it. Does the Take quiz button open the quiz?
    How: Use the green Start arrow. Log in and fill in the data entry form first.
    If not: Go to part 3.  [button: Go there ›]
  [tick box] Answer question 1 and press Check. Does its panel turn green or red?
    How: Green means right. Red means wrong.
    If not: Go to part 4.  [button: Go there ›]
  [tick box] Do question 2's buttons and question 3's list mark the answer?
    How: Try each one. The panel should turn green or red.
    If not: Go to part 5.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I have all these ✓]

## Part 2 of 6. The quiz form: its panels and buttons
Banner at the top of every screen in this part: "Part 2 of 6. You are making the quiz form"

### Screen ch06#2-0. Make the quiz form with its six panels and their controls
[Opening screen of this part, one card]
Each panel is filled with its own controls: labels, boxes, buttons and a list.
When it works, frmQuiz shows six panels in the Design tab. Every control has its name.
[Big button at the foot: Next ›]

### Screen ch06#2-1. Add the quiz form and its six panels
The quiz is a form of its own, with a score panel and five question panels.
STEP 1. Click the Project menu along the top. Click the line that starts Add Form.
  You should see: A box opens with Form picked in its list.
  If it goes wrong I cannot see that line. -> Click your project's name in Solution Explorer first. Then open the Project menu again.
STEP 2. In the Name box at the bottom, type frmQuiz.cs. Click Add.
  You should see: frmQuiz opens in the Design tab. It is empty.
STEP 3. Drag six panels from the Toolbox onto it. Name each one as the map shows.
  You should see: Six panels, each with a name that starts with pnl.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: Add a new form]
    picture 1: Open the Project menu. Click the line that starts Add Form.
    picture 2: Form is picked. Type the form's name in the Name box.
    picture 3: Click Add. The new form opens in the Design tab. My picture says frmTemp. Yours shows the name you typed.
Line above the big button: Done when frmQuiz is in Solution Explorer with six panels on it
[Big button at the foot: I've done this ✓]

### Screen ch06#2-2. See how the six panels are laid out
This picture shows the quiz form with its six panels and their names.
[Animated map of frmQuiz. Each panel lights up in turn, labelled with its name: pnlQuizScore, pnlTextQuestion, pnlButtonsQuestion, pnlListQuestion, pnlRadioQuestion, pnlNumberQuestion]
  Caption: Six panels: one for the score and one for each question.
Each panel is named for what is in it, not a number. So YOUR quiz can put its questions in any order.
Line above the big button: Done when you have read the name of each panel on the picture
[Big button at the foot: I've done this ✓]

### Screen ch06#2-3. Fill the score panel and the question 1 panel
Drag each control into its panel, then give it its name and its Text.
[Table of controls for frmQuiz. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Label | lblQuiz (the big Quiz title) | Text = Quiz
  Label | lblComment (the small line of words under the title) | Text = a line to start the quiz
  Label | lblScore (the label that says Score:) | Text = Score:
  Label | lblResult (the label that shows the score as a number) | Text = 0
  Button | btnReturn (the score panel's Return button) | Text = Return
  Button | btnHelpQuizScore (the ? button in the score panel) | Text = ?
  Label | lblQuestion1 (the words of question 1) | Text = question 1
  TextBox | tbxQuestion1 (the text box where question 1 is answered) | Nothing else to set
  Button | btnCheck1 (the Check button of question 1) | Text = Check
  You should see: The first six sit inside pnlQuizScore. The last three sit inside pnlTextQuestion.
Yours will be different MY questions are about water safety. Type YOUR five questions into the Text of each question label.
Line above the big button: Done when the score panel and the question 1 panel hold every control in the table
[Big button at the foot: I've done this ✓]

### Screen ch06#2-4. Fill the question 2 and question 3 panels
Question 2 is answered with one of two buttons, and question 3 from a drop-down list.
[Table of controls for frmQuiz. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Label | lblQuestion2 (the words of question 2) | Text = question 2
  Button | btnCorrect (the button of question 2 that is the right answer) | Text = the right answer
  Button | btnIncorrect (the button of question 2 that is the wrong answer) | Text = a wrong answer
  Label | lblQuestion3 (the words of question 3) | Text = question 3
  PictureBox | pbxQuestion3 (the picture that question 3 asks about) | Image = a picture for question 3
  ComboBox | cbxQuestion3 (the drop-down list where question 3 is answered) | Items = the choices, one per line
  Button | btnCheck3 (the Check button of question 3) | Text = Check
  You should see: The first three sit inside pnlButtonsQuestion. The last four sit inside pnlListQuestion.
In the Toolbox, PictureBox makes a picture box and ComboBox makes a drop-down list.
For Image, click the three dots beside it. Click Import, pick YOUR picture, then click OK. Items works as it did for the year group list in chapter 2.
Watch out Put the RIGHT answer first in the Items list. The code on screen 5-7 looks for it there.
Line above the big button: Done when the question 2 and question 3 panels hold every control in the table
[Big button at the foot: I've done this ✓]

### Screen ch06#2-5. Fill the question 4 and question 5 panels
Question 4 has four answers, and question 5 is answered with a number.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: Drag a group box, round buttons and a number box]
    picture 1: Drag a GroupBox into the question 4 panel.
    picture 2: Drag four RadioButtons INSIDE the group box.
    picture 3: Drag a NumericUpDown into the question 5 panel.
[Table of controls for frmQuiz. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  GroupBox | gbQuestion4 (question 4's group box of radio buttons) | Text = question 4
  RadioButton | rbA (the first radio button of question 4) | Text = answer A
  RadioButton | rbB (the second radio button of question 4) | Text = answer B
  RadioButton | rbC (the third radio button of question 4) | Text = answer C
  RadioButton | rbD (the fourth radio button of question 4) | Text = answer D
  Button | btnCheck4 (the Check button of question 4) | Text = Check
  Label | lblQuestion5 (the words of question 5) | Text = question 5
  NumericUpDown | nudQuestion5 (question 5's number box with arrows) | Nothing else to set
  Button | btnCheck5 (the Check button of question 5) | Text = Check
  You should see: The group box sits in pnlRadioQuestion, with the next five inside it. The last three sit inside pnlNumberQuestion.
Watch out The four round buttons and btnCheck4 go INSIDE the group box. Then only one round button can be picked.
Line above the big button: Done when the question 4 and question 5 panels hold every control in the table
[Big button at the foot: I've done this ✓]

## Part 3 of 6. Getting to the quiz
Banner at the top of every screen in this part: "Part 3 of 6. You are making the Take quiz button"

### Screen ch06#3-0. Make the Take quiz button open the quiz
[Opening screen of this part, one card]
The data entry form closes, so its details must already be in Global.cs. Then the quiz form opens.
When it works, pressing Take quiz closes the data entry form. The quiz appears in its place.
[Big button at the foot: Next ›]

### Screen ch06#3-1. Meet the two new things for Take quiz
The Take quiz button sits on the data entry form and swaps it for the quiz.
Four new things in this chapter. Two are on this screen. Click one to see what it means.
  this.Close() = Close this form for good.
  new frmQuiz().Show() = Make a new quiz form and show it.
  .ToLower() = Turn every letter into a small letter.
  BackColor = The background colour of a control.
Line above the big button: Done when you have read what this.Close() and new frmQuiz().Show() mean
[Big button at the foot: I've done this ✓]

### Screen ch06#3-2. Open the code behind the Take quiz button
The picture shows what the button does: one form closes and the other opens.
[Animated picture: The data entry form fades away. The quiz form appears in its place.]  Caption: The data entry form closes. The quiz form opens.
STEP 1. Open frmDataEntry in the Design tab. Double-click the Take quiz button.
  You should see: The code tab opens at btnTakeQuiz_Click.
Line above the big button: Done when the code tab is open at btnTakeQuiz_Click with your cursor between its curly brackets
[Big button at the foot: I've done this ✓]

### Screen ch06#3-3. Type the six lines that swap the forms
These six lines close the data entry form and open the quiz.
[CODE CARD. Type this. The Take quiz button]
  Where: between the curly brackets of btnTakeQuiz_Click
  [grey, already there] private void btnTakeQuiz_Click(object sender, EventArgs e)
  [grey, already there] {
      //closes frmDataEntry and loads frmQuiz
      this.Close();
      new frmQuiz().Show();
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 5] Close this form, open the quiz: A note for you. The data entry form closes. A new quiz form opens.
  [Line 6] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: frmQuiz]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of frmQuiz and picking it from the list]
this.Close() closes the data entry form. new frmQuiz().Show() makes the quiz and shows it.
Watch out The data entry form forgets everything when it closes. So its details are kept in Global.cs.
Line above the big button: Done when lines 1 to 6 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 4 of 6. Question 1: a typed answer
Banner at the top of every screen in this part: "Part 4 of 6. You are making question 1"

### Screen ch06#4-0. Make question 1's Check button mark a typed answer
[Opening screen of this part, one card]
A match adds a point and turns the panel green. Anything else turns it red.
When it works, question 1 goes green or red. Then question 2 switches on.
[Big button at the foot: Next ›]

### Screen ch06#4-1. Open the code behind question 1's Check button
Question 1 is typed in a box, and its Check button marks it.
.ToLower() turns every letter small. So EMERGENCY and Emergency both match.
BackColor is the background colour of a panel. Green means right. Red means wrong.
STEP 1. Open frmQuiz in the Design tab. Double-click the Check button of question 1.
  You should see: The code tab opens at btnCheck1_Click.
Line above the big button: Done when the code tab is open at btnCheck1_Click with your cursor between its curly brackets
[Big button at the foot: I've done this ✓]

### Screen ch06#4-2. Mark the typed answer right or wrong
These lines compare the typed answer with the right one, in small letters.
[CODE CARD. Type this. Question 1's Check button: code 1 of 2]
  Where: between the curly brackets of btnCheck1_Click
  [grey, already there] private void btnCheck1_Click(object sender, EventArgs e)
  [grey, already there] {
      if (tbxQuestion1.Text.ToLower() == "emergency")
      {
          Global.quizScore += 1;
          pnlTextQuestion.BackColor = Color.Green;
          lblResult.Text = Global.quizScore.ToString();
      }
      else
      {
          pnlTextQuestion.BackColor = Color.Red;
      }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 8] Right?: Is the answer, in small letters, emergency? Then add 1, turn the panel green and show the score.
  [Lines 9 to 12] Wrong: Any other answer turns the panel red.
  MY answer is emergency. Type YOUR answer, all in small letters.
  [Names in this code: tbxQuestion1, Global.quizScore, pnlTextQuestion, lblResult]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxQuestion1 and picking it from the list]
Line above the big button: Done when lines 1 to 12 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch06#4-3. See question 2 switch on
Right or wrong, the quiz moves on from question 1 to question 2.
[Animated diagram of frmQuiz. Panels switched on: pnlTextQuestion. Then pnlButtonsQuestion switches on.]
  Caption first: Question 1 is marked.
  Caption: The question 1 panel switches off. The question 2 panel switches on.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
Line above the big button: Done when you have watched the panels switch and read the line under the picture
[Big button at the foot: I've done this ✓]

### Screen ch06#4-4. Switch off question 1 and switch on question 2
These two lines run after a right answer and after a wrong one.
[CODE CARD. Type this. Question 1's Check button: code 2 of 2]
  Where: under code 1, inside btnCheck1_Click, in frmQuiz.cs
      pnlTextQuestion.Enabled = false;
      pnlButtonsQuestion.Enabled = true;
  [grey, already there] 
  [grey, already there] }
  [Lines 13 to 14] Move to the next question: Question 1 switches off. Question 2 switches on.
  [Lines 15 to 16] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Names in this code: pnlTextQuestion, pnlButtonsQuestion]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlButtonsQuestion and picking it from the list]
Watch out Type these two lines straight after the last line of code 1. They run for a right answer and a wrong one.
Line above the big button: Done when lines 13 to 16 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 5 of 6. Questions 2 and 3
Banner at the top of every screen in this part: "Part 5 of 6. You are making questions 2 and 3"

### Screen ch06#5-0. Mark the answers to questions 2 and 3
[Opening screen of this part, one card]
Each button of question 2 has its own code. The Check button of question 3 looks at which item is chosen.
When it works, each answer turns its panel green or red. Then the next question switches on.
[Big button at the foot: Next ›]

### Screen ch06#5-1. Open the code behind the right answer button
Question 2 has two buttons with their own code, and only one adds a point.
STEP 1. In the Design tab, double-click the right answer button of question 2.
  You should see: The code tab opens at btnCorrect_Click.
Line above the big button: Done when the code tab is open at btnCorrect_Click with your cursor between its curly brackets
[Big button at the foot: I've done this ✓]

### Screen ch06#5-2. Score a point when the right button is pressed
These lines add 1 to the score, turn the panel green and switch on question 3.
[CODE CARD. Type this. The right answer button]
  Where: between the curly brackets of btnCorrect_Click
  [grey, already there] private void btnCorrect_Click(object sender, EventArgs e)
  [grey, already there] {
      //If question is answred correctly, score incremented by 1, panel 2 is disabled and panel 3 is enabled
      Global.quizScore += 1;
      lblResult.Text = Global.quizScore.ToString();
      pnlButtonsQuestion.BackColor = Color.Green;
      pnlButtonsQuestion.Enabled = false;
      pnlListQuestion.Enabled = true;
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 5] Add a point: A note for you. Then 1 is added to the score, and the score is shown.
  [Lines 6 to 8] Green, then move on: The panel turns green. Question 2 switches off. Question 3 switches on.
  [Line 9] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  Which of YOUR two buttons is the right answer? Only that one scores.
  [Names in this code: Global.quizScore, lblResult, pnlButtonsQuestion, pnlListQuestion]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlListQuestion and picking it from the list]
Line above the big button: Done when lines 1 to 9 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch06#5-3. Open the code behind the wrong answer button
The wrong button does the same with two changes: no point, and the panel turns red.
STEP 1. In the Design tab, double-click the wrong answer button of question 2.
  You should see: The code tab opens at btnIncorrect_Click.
Line above the big button: Done when the code tab is open at btnIncorrect_Click with your cursor between its curly brackets
[Big button at the foot: I've done this ✓]

### Screen ch06#5-4. Turn question 2 red when the wrong button is pressed
These lines turn the panel red, add nothing, and still switch on question 3.
[CODE CARD. Type this. The wrong answer button]
  Where: between the curly brackets of btnIncorrect_Click
  [grey, already there] private void btnIncorrect_Click(object sender, EventArgs e)
  [grey, already there] {
      //if question is answered incorrectly, background changes red, panel 2 is disabled and panel three is enabled
      pnlButtonsQuestion.BackColor = Color.Red;
      pnlButtonsQuestion.Enabled = false;
      pnlListQuestion.Enabled = true;
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 6] Red, then move on: A note for you. The panel turns red. Question 2 switches off. Question 3 switches on.
  [Line 7] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: pnlButtonsQuestion, pnlListQuestion]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlButtonsQuestion and picking it from the list]
Watch out Each button has its own curly brackets. Type this code in btnIncorrect_Click, not in btnCorrect_Click.
Line above the big button: Done when lines 1 to 7 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch06#5-5. Open the code behind question 3's Check button
Question 3 is a drop-down list, and a user could press Check with nothing chosen.
.SelectedIndex == -1 asks if nothing is chosen. You met it in chapter 4.
STEP 1. In the Design tab, double-click the Check button of question 3.
  You should see: The code tab opens at btnCheck3_Click.
Line above the big button: Done when the code tab is open at btnCheck3_Click with your cursor between its curly brackets
[Big button at the foot: I've done this ✓]

### Screen ch06#5-6. Stop question 3 when nothing is chosen
These lines show a message when nothing is chosen, and do nothing else.
[CODE CARD. Type this. Question 3's Check button: code 1 of 3]
  Where: between the curly brackets of btnCheck3_Click
  [grey, already there] private void btnCheck3_Click(object sender, EventArgs e)
  [grey, already there] {
      if (cbxQuestion3.SelectedIndex == -1)
      {
          //if question 3 is left null, message appear, 'Please ensure you've made a choice, no choice made'
          MessageBox.Show("Please ensure you've made a choice", "No choice made!");
      }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 7] Nothing chosen?: If nothing is chosen, a note for you, then a message asks the user to choose.
  [Names in this code: cbxQuestion3]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of cbxQuestion3 and picking it from the list]
Watch out With nothing chosen, nothing else happens. The list stays switched on so the user can choose.
Line above the big button: Done when lines 1 to 7 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch06#5-7. Score a point when the right item is chosen
else runs when something is chosen, then asks if it is the right item.
The items are counted from 0. So the first item is number 0.
[CODE CARD. Type this. Question 3's Check button: code 2 of 3]
  Where: under code 1, inside btnCheck3_Click
      else
      {
          if (cbxQuestion3.SelectedIndex == 0)
          {
              //if question is answered correctly, panel backcolor changes to green
              Global.quizScore += 1;
              pnlListQuestion.BackColor = Color.Green;
              lblResult.Text = Global.quizScore.ToString();
          }
  [Lines 8 to 9] Something is chosen: else, then its curly bracket.
  [Lines 10 to 16] Right?: Is item 0 chosen? A note, then add 1, turn the panel green and show the score.
  MY right answer is the first item in the list, number 0. Count YOUR list from 0.
  [Names in this code: cbxQuestion3, Global.quizScore, pnlListQuestion, lblResult]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of cbxQuestion3 and picking it from the list]
Line above the big button: Done when lines 8 to 16 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch06#5-8. Turn question 3 red, then switch on question 4
Last, a wrong item turns the panel red, then the quiz moves on to question 4.
[CODE CARD. Type this. Question 3's Check button: code 3 of 3]
  Where: under code 2, inside btnCheck3_Click
          else
          {
              //if question answered incorrectly, panel backcolor changes to red
              pnlListQuestion.BackColor = Color.Red;
          }
          //Question 3 is disabled and panel 4 is enabled
          pnlListQuestion.Enabled = false;
          pnlRadioQuestion.Enabled = true;
  [grey, already there]     }
  [grey, already there] }
  [Lines 17 to 21] Wrong: Any other item. A note, then the panel turns red.
  [Lines 22 to 24] Move to the next question: A note. Question 3 switches off. Question 4 switches on.
  [Lines 25 to 26] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Names in this code: pnlListQuestion, pnlRadioQuestion]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlRadioQuestion and picking it from the list]
Watch out The two move-on lines sit inside the else of code 2. They never run when nothing is chosen.
Line above the big button: Done when lines 17 to 26 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 6 of 6. Try your first three questions
Banner at the top of every screen in this part: "Part 6 of 6. You are testing questions 1 to 3"

### Screen ch06#6-1. Try every way through questions 1, 2 and 3
Run your program, get to the Take quiz button, then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Press Take quiz.
    How: The data entry form closes. The quiz opens.
    If not: Look at the code on screen 3-3.  [button: Go there ›]
  [tick box] Must happen. Type YOUR question 1 answer in capitals. Press Check.
    How: The panel goes green. The score shows 1.
    If not: Look at the code on screen 4-2.  [button: Go there ›]
  [tick box] Must happen. Run it again. Type a wrong answer for question 1. Press Check.
    How: The panel goes red. Question 2 can be clicked.
    If not: Look at the code on screen 4-4.  [button: Go there ›]
  [tick box] Must happen. Press the right button for question 2.
    How: The panel goes green and the score goes up by 1.
    If not: Look at the code on screen 5-2.  [button: Go there ›]
  [tick box] Must NOT happen. Choose nothing in the list and press Check.
    How: A message asks you to choose. The quiz must NOT move on to question 4.
    If not: If it moved on, look at the code on screen 5-6.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: Chapter 6 is done ✓]

# Chapter 7. The quiz: questions 4 and 5, and the score
Under the title: Only question 1 works at the start, mark questions 4 and 5, send the score back.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 6. Check your quiz has what it needs
Banner at the top of every screen in this part: "Part 1 of 6. You are checking the quiz form you already have"

### Screen ch07#1-1. Check your quiz has what it needs
Before you code the rest of the quiz, tick each row you already have.
Open your project in the Programming Environment and look. A row you have not got tells you where to go.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Open frmQuiz in the Design tab. Does question 4 have a group box, four radio buttons and a Check button?
    How: In my example it is the panel on the right of the middle row. In yours, look for the panel with the radio buttons.
    If not: Go to chapter 6, part 2.  [button: Go there ›]
  [tick box] Does question 5 have a number box and a Check button?
    How: In my example it is the wide panel along the bottom. Yours may be somewhere else. Look for the number box.
    If not: Go to chapter 6, part 2.  [button: Go there ›]
  [tick box] Is there a Return button in the score panel?
    How: In my example it is near the bottom of the tall panel on the left. Yours is in your score panel.
    If not: Go to chapter 6, part 2.  [button: Go there ›]
  [tick box] Double-click question 3's Check button. Is there code between its two curly brackets?
    How: The code tab opens at the code behind that button. Lines between the curly brackets mean yes.
    If not: Go to chapter 6, part 5.  [button: Go there ›]
  [tick box] Open Global.cs. Are quizScore and quizTaken in it? quizScore counts the right answers. quizTaken remembers whether the quiz has been done.
    How: Solution Explorer is on the right. Double-click Global.cs to open it. Look for the two lines with those names.
    If not: Go to chapter 3, part 3.  [button: Go there ›]
[Fold-out box, closed until clicked: Not sure where to look?]
  Solution Explorer is on the right of Visual Studio 2019. It lists every form. Double-click frmQuiz to see it in the Design tab. Right-click it and choose View Code to see its code.
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I have all these ✓]

## Part 2 of 6. Make only question 1 work when the quiz opens
Banner at the top of every screen in this part: "Part 2 of 6. You are making what happens when the quiz opens"

### Screen ch07#2-0. Make the quiz open with only question 1 working
[Opening screen of this part, one card]
The Load event is code that runs by itself the moment the quiz form opens. Nobody clicks it.
When it works, only question 1 can be clicked when the quiz opens. Questions 2 to 5 are grey and the Return button is hidden.
[Big button at the foot: Next ›]

### Screen ch07#2-1. Meet the Load event
Right now the quiz opens with all five questions clickable, which the Load event fixes.
Four new things in this chapter. Click any marked word to see what it means.
  Load event = Code that runs by itself the moment the form opens, before anyone clicks anything.
  .Checked = Tells you if a radio button's dot is filled in. True if it is, false if it is not.
  return; = Stop here. Nothing under this line runs.
  .Value = The number showing in a number box.
A Load event runs by itself the moment the form opens. Nobody clicks it. You have not used one yet, and the quiz needs one.
Watch out A Load event is not a button. Nobody clicks it. It runs by itself when the form opens.
Line above the big button: Done when you can say what a Load event is in your own words
[Big button at the foot: Next ›]

### Screen ch07#2-2. See what the Load event will do
Watch the quiz form open and its Load event run before anyone has clicked.
[Animated picture: The quiz form slides in. A code card lights up under it with the words runs now.]  Caption: The quiz form opens. Its Load event runs straight away. Nobody has clicked anything.
Every form can have a Load event if you want one. The quiz needs one, so that is where you write your first.
Watch out Nothing is clicked. The Load event runs by itself.
Line above the big button: Done when you know the Load event runs by itself, before any click
[Big button at the foot: Next ›]

### Screen ch07#2-3. Double-click the form to open its Load code
Visual Studio makes the Load event for you when you double-click the form itself.
STEP 1. Open frmQuiz in the Design tab.
  You should see: You can see the quiz form with its panels.
STEP 2. Double-click the form itself. The title bar at the top of the form is the safest spot.
  You should see: The code tab opens. Visual Studio has written frmQuiz_Load for you, with two curly brackets.
  If it goes wrong I got a panel's code or a button's code instead. -> You double-clicked a control, not the form. Go back to the Design tab and double-click the form's title bar.
STEP 3. Look where your cursor is blinking.
  You should see: It is between the two curly brackets of frmQuiz_Load. That is where your code goes.
Watch out Double-click the FORM, not a panel or a button. Double-clicking a button gives you that button's code instead.
Line above the big button: Done when the code tab is open at frmQuiz_Load with your cursor between its curly brackets
[Big button at the foot: I've done this ✓]

### Screen ch07#2-4. See why only question 1 can be clicked
Here is what the quiz should look like the moment it opens.
[Animated diagram of frmQuiz. Panels switched on: pnlQuizScore, pnlTextQuestion.]
  Caption: Only question 1 and the score are on. The rest are grey.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
Each question sits in its own panel. A switched-off panel goes grey, and nothing in it can be clicked.
So the Load event has two jobs. Switch off the four panels for questions 2 to 5. Hide the Return button until the quiz is over.
Watch out Count them: four panels to switch off, and one Return button to hide.
Line above the big button: Done when you can name the four panels the Load event switches off
[Big button at the foot: Next ›]

### Screen ch07#2-5. Type the code that switches off questions 2 to 5
Now type the Load event's code: four panels switched off and one button hidden.
[CODE CARD. Type this. The quiz's Load event]
  Where: between the curly brackets of frmQuiz_Load, in frmQuiz.cs
  [grey, already there] private void frmQuiz_Load(object sender, EventArgs e)
  [grey, already there] {
      //Enables panels upon loading
      pnlButtonsQuestion.Enabled = false;
      pnlListQuestion.Enabled = false;
      pnlRadioQuestion.Enabled = false;
      pnlNumberQuestion.Enabled = false;
      btnReturn.Visible = false;
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 7] Switch off questions 2 to 5: The line that starts with two slashes is a note for you. The computer skips it. Then one line per panel. Enabled = false switches the panel off and turns it grey.
  [Line 8] Hide the Return button: Visible = false hides the button. Question 5's Check button brings it back at the end.
  [Line 9] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: pnlButtonsQuestion, pnlListQuestion, pnlRadioQuestion, pnlNumberQuestion, btnReturn]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlButtonsQuestion and picking it from the list]
[Fold-out box, closed until clicked: See the real IntelliSense list]
  [Picture strip: IntelliSense in Visual Studio 2019]
    picture 1: Type the first letters of the name.
    picture 2: The list pops up with every matching name in YOUR program.
    picture 3: Press Tab. The name is typed for you, spelt right.
Watch out Four panels get Enabled = false. The Return button gets Visible = false, which hides it.
Line above the big button: Done when lines 3 to 8 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 3 of 6. Mark question 4, the one with radio buttons
Banner at the top of every screen in this part: "Part 3 of 6. You are making question 4's Check button"

### Screen ch07#3-0. Make question 4's Check button work
[Opening screen of this part, one card]
Question 4 has four radio buttons and a Check button. The code behind that Check button marks the answer.
When it works, Check marks the answer, switches question 4 off and switches question 5 on. With no dot filled in, it shows a message instead.
[Big button at the foot: Next ›]

### Screen ch07#3-1. See how code tells which radio button is chosen
Before you type, see how code asks a radio button whether its dot is filled in.
[CODE CARD. Read this. Two ways to ask a radio button]
  rbB.Checked
  !rbA.Checked
  [Line 1] Is B chosen?: True when the dot of rbB is filled in.
  [Line 2] Is A NOT chosen?: The exclamation mark means NOT. True when the dot of rbA is empty.
  [Names in this code: rbA, rbB]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Every radio button has .Checked. It is true when the dot is filled in. In my example the radio buttons are rbA, rbB, rbC and rbD. Yours have the names you gave them.
Watch out An exclamation mark in front means NOT. Read !rbA.Checked as: A is not chosen.
Line above the big button: Done when you can read rbB.Checked and !rbA.Checked out loud in words
[Big button at the foot: Next ›]

### Screen ch07#3-2. Find question 4's Check button on the form
Everything question 4 does happens when its Check button is clicked, so first find that button.
[Picture strip: Opening the code behind a button]
  picture 1: In the Design tab, double-click the button.
  picture 2: The code tab opens. Visual Studio wrote the first and last lines.
Line above the big button: Done when you can point to question 4's Check button in the Design tab
[Big button at the foot: Next ›]

### Screen ch07#3-3. Double-click question 4's Check button
Now open the code behind question 4's Check button.
STEP 1. In the Design tab of frmQuiz, double-click question 4's Check button.
  You should see: The code tab opens at btnCheck4_Click. It is empty between the curly brackets.
Watch out Double-click the button itself, not the panel around it. The panel would give you code you do not want.
Line above the big button: Done when the code tab is open at btnCheck4_Click, empty between the curly brackets
[Big button at the foot: I've done this ✓]

### Screen ch07#3-4. See why the code must stop when nothing is chosen
Think about a pupil who clicks Check without choosing an answer.
An empty answer should not be marked. So the first thing the Check button does is look at all four dots. If none is filled in, it shows a message and stops.
[Animated picture: A stop sign drops onto the return line of the code.]  Caption: The stop sign lands on return. Nothing under this line runs.
return; means stop here. When nothing is chosen, nothing under that line runs.
Watch out Each && means AND. All four dots must be empty for the message to show.
Line above the big button: Done when you can say what return does when no dot is filled in
[Big button at the foot: Next ›]

### Screen ch07#3-5. Type the check for no radio button chosen
Type the four-dot check: show a message and stop when no dot is filled in.
[CODE CARD. Type this. Question 4's Check button: code 1 of 3]
  Where: between the curly brackets of btnCheck4_Click, in frmQuiz.cs
  [grey, already there] private void btnCheck4_Click(object sender, EventArgs e)
  [grey, already there] {
      if (!rbA.Checked && !rbB.Checked && !rbC.Checked && !rbD.Checked)
      {
          //nothing has been chosen yet, so stop here and let the pupil choose
          MessageBox.Show("Please choose one of the answers", "No choice made!");
          return;
      }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 8] No dot filled in? Show a message and stop: The if line asks: are all four dots empty? If they are, a message pops up. Then return stops the code here.
  [Names in this code: rbA, rbB, rbC, rbD]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of rbA and picking it from the list]
Watch out In my example the dots are rbA, rbB, rbC and rbD. Use the names of YOUR four radio buttons.
Line above the big button: Done when lines 3 to 8 are typed with no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch07#3-6. Add 1 to the score if the answer is right
Now type the marking: the right dot scores 1, any other dot turns the box red.
[CODE CARD. Type this. Question 4's Check button: code 2 of 3]
  Where: between the curly brackets of btnCheck4_Click, in frmQuiz.cs
      if (rbB.Checked)
      {
          //the correct answer was chosen, so the score goes up by 1
          Global.quizScore += 1;
          lblResult.Text = Global.quizScore.ToString();
          gbQuestion4.BackColor = Color.Green;
      }
      else
      {
          gbQuestion4.BackColor = Color.Red;
      }
  [Lines 9 to 15] Right answer: score up by 1, box goes green: If rbB is chosen, 1 is added to Global.quizScore. The label shows the new score. The group box turns green.
  [Lines 16 to 19] Wrong answer: box goes red: Any other dot turns the group box red. The score stays as it was.
  In my example the right answer is the second radio button, rbB. Look at YOUR question 4. Which of YOUR radio buttons is the right answer? Use that one's name.
  [Names in this code: rbB, Global.quizScore, lblResult, gbQuestion4]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of lblResult and picking it from the list]
Watch out Type this after the } that closes the first if, not inside it.
Line above the big button: Done when lines 9 to 19 are typed, using YOUR right radio button's name
[Big button at the foot: I've done this ✓]

### Screen ch07#3-7. Switch question 4 off and question 5 on
Question 4 is marked, so now switch its panel off and wake question 5 up.
[CODE CARD. Type this. Question 4's Check button: code 3 of 3]
  Where: between the curly brackets of btnCheck4_Click, in frmQuiz.cs
      //question 4 is finished, so it is locked and question 5 is unlocked
      pnlRadioQuestion.Enabled = false;
      pnlNumberQuestion.Enabled = true;
  [grey, already there] }
  [Lines 20 to 22] Switch off question 4, switch on question 5: Question 4's panel gets Enabled = false and goes grey. Question 5's panel gets Enabled = true and wakes up.
  [Line 23] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: pnlRadioQuestion, pnlNumberQuestion]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlNumberQuestion and picking it from the list]
Watch out Type these lines after the } that closes the else, but before the last }. They run whether the answer was right or wrong.
Line above the big button: Done when lines 20 to 22 are typed above the last curly bracket
[Big button at the foot: I've done this ✓]

### Screen ch07#3-8. Watch what question 4's Check button now does
Watch what happens to the panels when the right answer is checked.
[Animated diagram of frmQuiz. Panels switched on: pnlQuizScore, pnlRadioQuestion. Then pnlNumberQuestion switches on.]
  Caption first: Question 4 is on. The right dot is filled in.
  Caption: Question 4 switches off. Question 5 switches on.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
Watch out Whatever the answer was, question 4 goes grey and question 5 wakes up.
Line above the big button: Done when you have played the picture and seen question 5 light up
[Big button at the foot: Next ›]

### Screen ch07#3-9. Run your quiz and try question 4
Time to see it work in your own quiz.
STEP 1. Click the green Start arrow at the top. Log in, go to the quiz and play through to question 4.
  You should see: After Check, question 4 goes grey and question 5 is awake.
  If it goes wrong Red errors appeared instead. -> The Error List at the bottom names the line. Double-click the error to jump to it.
Watch out Question 5 still grey? Look again at the last three lines you typed.
Line above the big button: Done when after Check, your question 4 is grey and question 5 is awake
[Big button at the foot: I've done this ✓]

## Part 4 of 6. Mark question 5, the one with the number box
Banner at the top of every screen in this part: "Part 4 of 6. You are making question 5's Check button"

### Screen ch07#4-0. Make question 5's Check button work
[Opening screen of this part, one card]
Question 5 is the last question. It has a number box with arrows and its own Check button.
When it works, Check adds 1 to the score for the right number. The panel turns green or red, and the Return button appears.
[Big button at the foot: Next ›]

### Screen ch07#4-1. Double-click question 5's Check button
Open the code behind question 5's Check button the same way as question 4's.
STEP 1. In the Design tab, double-click question 5's Check button.
  You should see: The code tab opens at btnCheck5_Click, empty between the curly brackets.
Question 5 uses a number box. The pupil clicks the little arrows to pick a number. Your code reads that number with .Value and checks whether it is the right answer.
Line above the big button: Done when the code tab is open at btnCheck5_Click, empty between the curly brackets
[Big button at the foot: I've done this ✓]

### Screen ch07#4-2. Add 1 to the score if the number is right
Type code 1 of 2 for question 5's Check button: the marking.
[CODE CARD. Type this. Question 5's Check button: code 1 of 2]
  Where: between the curly brackets of btnCheck5_Click, in frmQuiz.cs
  [grey, already there] private void btnCheck5_Click(object sender, EventArgs e)
  [grey, already there] {
      if (nudQuestion5.Value == 8)
      {
          //if the correct number is selected from the numeric up-down, score is incremented by 1
          Global.quizScore += 1;
          lblResult.Text = Global.quizScore.ToString();
          pnlNumberQuestion.BackColor = Color.Green;
      }
      else
      {
          //if the incorrect number is selected from the numeric up-down, panel color changes red
          pnlNumberQuestion.BackColor = Color.Red;
      }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 9] Right number: score up by 1, panel goes green: If the box shows 8, 1 is added to the score. The label shows it. The panel turns green.
  [Lines 10 to 14] Wrong number: panel goes red: Any other number turns the panel red.
  In my example the right number is 8. YOUR question 5 has its own right answer. Use YOUR number.
  [Names in this code: nudQuestion5, Global.quizScore, lblResult, pnlNumberQuestion]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of nudQuestion5 and picking it from the list]
Watch out Two equals signs ask a question: is it the same as 8? One equals sign would try to change it.
Line above the big button: Done when lines 3 to 14 are typed with YOUR right number
[Big button at the foot: I've done this ✓]

### Screen ch07#4-3. Switch off question 5 and show the Return button
Question 5 is the last one, so after it is marked the Return button can appear.
[CODE CARD. Type this. Question 5's Check button: code 2 of 2]
  Where: between the curly brackets of btnCheck5_Click, in frmQuiz.cs
      //panel 5 is disabled and the Return button becomes visible
      pnlNumberQuestion.Enabled = false;
      btnReturn.Visible = true;
  [grey, already there] }
  [Lines 15 to 17] Switch off question 5, show the Return button: Question 5's panel gets Enabled = false. The Return button gets Visible = true and appears.
  [Line 18] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: pnlNumberQuestion, btnReturn]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of btnReturn and picking it from the list]
Watch out Visible = true brings the button back. The Load event hid it with Visible = false.
Line above the big button: Done when lines 15 to 17 are typed above the last curly bracket
[Big button at the foot: I've done this ✓]

### Screen ch07#4-4. See the quiz played from start to end
Before you play your own quiz, see mine played from the start to the Return button.
[Picture strip: The running quiz]
  picture 1: The quiz opens: only question 1 on, no Return button.
  picture 2: Question 1 is marked and grey. Question 2 is switched on.
  picture 3: All five are marked. The Return button has appeared.
Line above the big button: Done when you have seen the Return button appear after question 5
[Big button at the foot: Next ›]

### Screen ch07#4-5. Play your own quiz
Play your quiz from the start and watch the panels wake up one after another.
STEP 1. Click the green Start arrow. Play the quiz through to question 5.
  You should see: After question 5's Check, the Return button appears in the score panel.
Watch out No Return button after question 5? Look at the Load event and at question 5's Check button.
Line above the big button: Done when the Return button appears after you check question 5 in your quiz
[Big button at the foot: I've done this ✓]

## Part 5 of 6. Send the score back to the data entry form
Banner at the top of every screen in this part: "Part 5 of 6. You are making the Return button"

### Screen ch07#5-0. Make the Return button work
[Opening screen of this part, one card]
The Return button in the score panel takes the pupil back to the data entry form.
When it works, Return leaves a note in Global.cs that the quiz is taken. Then it closes the quiz and opens the data entry form.
[Big button at the foot: Next ›]

### Screen ch07#5-1. Double-click the Return button
Open the code behind the Return button in the score panel.
STEP 1. In the Design tab, double-click the Return button in the score panel.
  You should see: The code tab opens at btnReturn_Click, empty between the curly brackets.
When a form closes, it forgets everything. Global.cs does not forget. Global.quizTaken is one thing in Global.cs. It is false until the quiz is taken. The Return button sets it to true.
Line above the big button: Done when the code tab is open at btnReturn_Click, empty between the curly brackets
[Big button at the foot: I've done this ✓]

### Screen ch07#5-2. Type the code that sends the score back
Type the three lines: leave the note, close the quiz, open the data entry form.
[CODE CARD. Type this. The Return button]
  Where: between the curly brackets of btnReturn_Click, in frmQuiz.cs
  [grey, already there] private void btnReturn_Click(object sender, EventArgs e)
  [grey, already there] {
      //closes quiz form and re-opens frmDataEntry
      Global.quizTaken = true;
      this.Close();
      new frmDataEntry().Show();
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 6] Leave the note, close, go back: Global.quizTaken becomes true. this.Close() closes the quiz form. The last line makes a new data entry form and shows it.
  [Line 7] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: Global.quizTaken, frmDataEntry]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of Global.quizTaken and picking it from the list]
Watch out The order matters. Leave the note first, then close, then open the data entry form.
Line above the big button: Done when lines 3 to 6 are typed in that order
[Big button at the foot: I've done this ✓]

### Screen ch07#5-3. Why the data entry form still says Quiz not taken
Press Return and the data entry form comes back saying Quiz not taken yet.
The name boxes are empty too. That is fine. Nothing is broken. The note is in Global.cs. The data entry form has not read it yet.
[Animated picture: The fresh data entry form on the left, Global.cs on the right with quizTaken set to true.]  Caption: The fresh data entry form on the left. Global.cs on the right, with quizTaken set to true.
In chapter 8 the data entry form gets its own Load event. That Load event reads the note when the form opens.
Watch out Do not try to fix this now. Chapter 8 is where it gets fixed.
Line above the big button: Done when you know chapter 8 is where the data entry form reads the note
[Big button at the foot: Next ›]

## Part 6 of 6. Test the whole quiz
Banner at the top of every screen in this part: "Part 6 of 6. You are testing the whole quiz"

### Screen ch07#6-1. Test the whole quiz
Run your program and try each row, ticking the rows that work.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Log in, type the details, work out the average, press Take Quiz.
    How: Only question 1 can be clicked. The other four are grey.
    If not: Open the Load event's code again.  [button: Go there ›]
  [tick box] Must happen. Answer questions 1 to 3. Then press question 4's Check with no dot filled in.
    How: A message appears. Question 4 stays switched on.
    If not: Open the no-dot check again.  [button: Go there ›]
  [tick box] Must happen. Choose the right radio button and press Check.
    How: The group box turns green and the score goes up by 1.
    If not: Open the marking code again.  [button: Go there ›]
  [tick box] Must happen. Set the right number on question 5 and press Check.
    How: The panel turns green and the Return button appears.
    If not: Open question 5's code again.  [button: Go there ›]
  [tick box] Must happen. Press Return.
    How: The quiz closes and the data entry form comes back.
    If not: Open the Return button's code again.  [button: Go there ›]
  [tick box] Must NOT happen. Start the quiz again. Press question 5's Check before question 4 is answered.
    How: Nothing happens, because question 5's panel is grey.
    If not: Open the Load event's code again.  [button: Go there ›]
Line above the big button: Done when all six rows are ticked
[Big button at the foot: Chapter 7 is done ✓]

# Chapter 8. The data entry form: its Load event
Under the title: When the form opens, read Global.cs and switch on the right panel.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 5. Check what you need first
Banner at the top of every screen in this part: "Part 1 of 5. You are checking the parts this chapter needs"

### Screen ch08#1-1. Check the parts this chapter needs
This chapter uses work from earlier chapters, so this screen checks that it is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Does your Enter button have its code from chapter 4?
    How: Double-click the Enter button in the Design tab. Look between its curly brackets.
    If not: Go to chapter 4.  [button: Go there ›]
  [tick box] Does your average button have its code from chapter 5?
    How: Double-click the average button in the Design tab.
    If not: Go to chapter 5.  [button: Go there ›]
  [tick box] Does the Return button on the quiz set Global.quizTaken to true?
    How: Open frmQuiz. Double-click the Return button. Look for quizTaken.
    If not: Go to chapter 7, part 5.  [button: Go there ›]
  [tick box] Does Global.cs have quizTaken, averageCalculated and reactionTestTaken?
    How: Double-click Global.cs in Solution Explorer.
    If not: Go to chapter 3, part 3.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I have all these ✓]

## Part 2 of 5. The problem and the plan
Banner at the top of every screen in this part: "Part 2 of 5. You are making the Load event"

### Screen ch08#2-0. Make a Load event for the data entry form
[Opening screen of this part, one card]
A Load event is code that runs by itself the moment a form opens. You made one for the quiz in chapter 7.
When it works, the code tab is open at frmDataEntry_Load. Its curly brackets are still empty.
[Big button at the foot: Next ›]

### Screen ch08#2-1. Why the form must read Global.cs as it opens
Take quiz closes the data entry form, and the quiz's Return button opens a new one.
[Animated picture: A brand new empty data entry form on the left. Global.cs on the right still holds the quiz score.]  Caption: The new data entry form is empty. Global.cs still holds everything.
Every time the data entry form opens, it is brand new and empty. Global.cs still has it all, so the form must ask Global.cs the moment it opens.
Code that runs the moment a form opens is a Load event. You met one in chapter 7.
Line above the big button: Done when you have read the picture and the lines under it
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
Line above the big button: Done when the code tab is open at frmDataEntry_Load with your cursor between its curly brackets
[Big button at the foot: I've done this ✓]

## Part 3 of 5. Switch everything off first
Banner at the top of every screen in this part: "Part 3 of 5. You are making the switch-off lines"

### Screen ch08#3-0. Switch every panel off as the form opens
[Opening screen of this part, one card]
Every panel starts switched off. The next part switches on only the right one.
When it works, lines 1 to 9 are typed. Nothing on the form can be clicked yet.
[Big button at the foot: Next ›]

### Screen ch08#3-1. See every panel switched off
The Load event starts by switching every panel off, as this picture shows.
[Animated diagram of frmDataEntry. Panels switched on: .]
  Caption: All five panels are switched off. Nothing can be clicked yet.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
Line above the big button: Done when you have looked at the picture and read the line under it
[Big button at the foot: I've done this ✓]

### Screen ch08#3-2. Switch off all five panels
These nine lines switch off each of the five panels in turn.
[CODE CARD. Type this. The Load event: code 1 of 6]
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
Watch out Start with every panel off. The next screens switch on the right one.
Line above the big button: Done when lines 1 to 9 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 4 of 5. Three questions for Global.cs
Banner at the top of every screen in this part: "Part 4 of 5. You are making the three questions for Global.cs"

### Screen ch08#4-0. Ask Global.cs three questions and switch on the right panel
[Opening screen of this part, one card]
The first question has an else for a brand new pupil. The other two have no else.
When it works, the form shows the details and scores a pupil already has. Only the right panel can be clicked.
[Big button at the foot: Next ›]

### Screen ch08#4-1. Show the score when the quiz has been taken
Question 1 for Global.cs: has the quiz been taken, and if so, show the score.
Two new things in this chapter. Click any marked word to see what it means.
  ForeColor = The colour of the writing on a control.
  Visible = false = Hide it. It is still there, but nobody can see it.
ForeColor is the colour of the writing. Visible = false hides the Take quiz button.
[CODE CARD. Type this. The Load event: code 2 of 6]
  Where: under code 1, inside frmDataEntry_Load
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
Watch out The curly bracket of the if stays open here. Code 3 closes it.
Line above the big button: Done when lines 10 to 17 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch08#4-2. Put the pupil's details back in their boxes
Still inside the yes part, the pupil's details come back from Global.cs into their boxes.
[CODE CARD. Type this. The Load event: code 3 of 6]
  Where: under code 2, inside frmDataEntry_Load
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
Line above the big button: Done when lines 18 to 26 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch08#4-3. See the details panel switch on for a new pupil
else means otherwise, and here it runs when the quiz has not been taken yet.
[Animated diagram of frmDataEntry. Panels switched on: . Then pnlPupilDetails switches on.]
  Caption: Only the details panel switches on. The other four stay switched off.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
Line above the big button: Done when you have looked at the picture and read the line under it
[Big button at the foot: I've done this ✓]

### Screen ch08#4-4. Switch on only the details panel
These lines switch on the details panel and show Quiz not taken yet in red.
[CODE CARD. Type this. The Load event: code 4 of 6]
  Where: under code 3, inside frmDataEntry_Load
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
Line above the big button: Done when lines 27 to 35 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch08#4-5. Show the attempts when the average is worked out
Question 2 for Global.cs: is the average worked out, and if so, put the numbers back.
The numbers are kept as numbers. .ToString() turns each one into words for its box.
[CODE CARD. Type this. The Load event: code 5 of 6]
  Where: under code 4, inside frmDataEntry_Load
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
  [Names in this code: Global.averageCalculated, tbxAttempt1, Global.attempt1, tbxAttempt2, Global.attempt2, tbxAttempt3, Global.attempt3, tbxCalculateAverage, Global.average, btnCalculateAverage, pnlSwimLengths]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxAttempt1 and picking it from the list]
Watch out This question has no else. If the average is not worked out, nothing happens here.
Line above the big button: Done when lines 36 to 45 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch08#4-6. See the group panel switch on after the test
Question 3 for Global.cs: has the reaction test been taken?
[Animated diagram of frmDataEntry. Panels switched on: pnlReactionTest. Then pnlSwimmingGroup switches on.]
  Caption: The test panel switches off. The group panel switches on.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
Line above the big button: Done when you have looked at the picture and read the line under it
[Big button at the foot: I've done this ✓]

### Screen ch08#4-7. Switch on the group panel when the test is taken
These lines show the test score, hide Take test and switch the panels over.
[CODE CARD. Type this. The Load event: code 6 of 6]
  Where: under code 5, inside frmDataEntry_Load
      if (Global.reactionTestTaken == true)
      {
          lblTestStatus.Text = Global.reactionTestScore.ToString();
          btnTakeTest.Visible = false;
          pnlReactionTest.Enabled = false;
          pnlSwimmingGroup.Enabled = true;
      }
  [grey, already there] 
  [grey, already there] }
  [Lines 46 to 52] Question 3: is the test taken?: If yes, the score shows and the group panel switches on. A red line under btnTakeTest is fine. Chapter 9 makes it.
  [Lines 53 to 54] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Names in this code: Global.reactionTestTaken, lblTestStatus, Global.reactionTestScore, btnTakeTest, pnlReactionTest, pnlSwimmingGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of lblTestStatus and picking it from the list]
Line above the big button: Done when lines 46 to 54 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 5 of 5. Try your Load event
Banner at the top of every screen in this part: "Part 5 of 5. You are testing your Load event"

### Screen ch08#5-1. Try the data entry form before and after the quiz
Run your program and log in, then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Look at the data entry form as it opens.
    How: Only the details panel can be clicked. The quiz status says Quiz not taken yet in red.
    If not: Look at the code on screen 4-4.  [button: Go there ›]
  [tick box] Must happen. Fill in the details. Click the Enter button. Take the quiz. Click its Return button.
    How: The details are back in their boxes. The score shows in black.
    If not: Look at the code on screens 4-1 and 4-2.  [button: Go there ›]
  [tick box] Must happen. After the quiz, try the reaction test panel.
    How: The reaction test panel can be clicked.
    If not: Look at the code on screen 4-1.  [button: Go there ›]
  [tick box] Must NOT happen. After the quiz, look for the Take quiz button.
    How: It must NOT be there.
    If not: If it is there, look at the code on screen 4-1.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: Chapter 8 is done ✓]
