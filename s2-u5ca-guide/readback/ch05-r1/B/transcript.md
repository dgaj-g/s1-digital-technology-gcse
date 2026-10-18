# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 5. The average of three attempts
Under the title: Three numbers in, one average out, kept in Global.cs.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what your average button has

### Screen ch05#1-1. Check what your average button already does
Your average button may have some code already. This screen checks what is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] In the Design tab, double-click the average button. Is there code between its curly brackets?
    How: The code tab opens at btnCalculateAverage_Click. Lines between the curly brackets mean yes.
    If not: Go to stage 2.  [button: Go there ›]
  [tick box] Run it. Type letters in an attempt box and press the button. Does a number only message appear?
    How: Use the green Start arrow. Log in and fill in the details first.
    If not: Go to stage 2.  [button: Go there ›]
  [tick box] Type 5, 6 and 7 and press the button. Does 6 appear and the quiz panel switch on?
    How: The average shows in the box beside the button.
    If not: Go to stage 3.  [button: Go there ›]
[Big button at the foot: I have all these ✓]

## Stage 2. Check the three boxes

### Screen ch05#2-1. Start by trusting the three boxes
The average button checks the three attempt boxes before it adds them up.
It starts by trusting them. Then any check that fails changes its mind.
Five new things in this chapter. Click any marked word to see what it means.
  ! = Not. It turns true into false.
  .All(char.IsDigit) = Is every character a number from 0 to 9?
  Convert.ToDouble = Turn the words in a box into a number with a point.
  Math.Round(x, 2) = Cut a number down to 2 numbers after the point.
  .ToString() = Turn a number back into words, so a box can show it.
STEP 1. In the Design tab, double-click the average button.
  You should see: The code tab opens at btnCalculateAverage_Click.
[CODE CARD. Type this. The average button, part 1 of 8]
  Where: between the curly brackets of btnCalculateAverage_Click
  [grey, already there] private void btnCalculateAverage_Click(object sender, EventArgs e)
  [grey, already there] {
      bool passValidation = true;
  
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] Trust the boxes: passValidation is a bool. It is true or false. It starts true.
  [Names in this code: passValidation]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of bool and picking it from the list]
Watch out passValidation starts true. Only a failed check turns it false.
[Big button at the foot: I've done this ✓]

### Screen ch05#2-2. Turn passValidation false when a box is empty
The first check asks: is any of the three boxes empty?
It is the same question as on the Enter button, asked three times. Two straight lines mean or.
[CODE CARD. Type this. The average button, part 2 of 8]
  Where: under part 1, inside btnCalculateAverage_Click
      if (string.IsNullOrWhiteSpace(tbxAttempt1.Text) || string.IsNullOrWhiteSpace(tbxAttempt2.Text) || string.IsNullOrWhiteSpace(tbxAttempt3.Text))
      {
          passValidation = false;
      }
  
  [Line 5] Is a box empty?: Is attempt 1 empty, OR attempt 2, OR attempt 3? It is all one line.
  [Lines 6 to 9] Then do not trust them: passValidation becomes false.
  [Names in this code: tbxAttempt1, tbxAttempt2, tbxAttempt3, passValidation]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxAttempt1 and picking it from the list]
Watch out Type the question as one long line. Visual Studio wraps it for you.
[Big button at the foot: I've done this ✓]

### Screen ch05#2-3. Turn passValidation false when attempt 1 holds a letter
The next check asks: does a box hold anything that is not a number?
.All(char.IsDigit) asks if every character is a number. ! in front turns the answer round.
So the question means: is it NOT all numbers?
[CODE CARD. Type this. The average button, part 3 of 8]
  Where: under part 2, inside btnCalculateAverage_Click
      if (!tbxAttempt1.Text.All(char.IsDigit))
      {
          passValidation = false;
      }
  
  [Line 10] Attempt 1 not all numbers?: Is the first box NOT all numbers?
  [Lines 11 to 14] Then do not trust them: passValidation becomes false.
  [Names in this code: tbxAttempt1, passValidation]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxAttempt1 and picking it from the list]
Watch out The ! goes straight in front of the box name. There is no space.
[Big button at the foot: I've done this ✓]

### Screen ch05#2-4. Do the same check for attempts 2 and 3
Now the same check for the other two boxes. Only the box name changes.
[CODE CARD. Type this. The average button, part 4 of 8]
  Where: under part 3, inside btnCalculateAverage_Click
      if (!tbxAttempt2.Text.All(char.IsDigit))
      {
          passValidation = false;
      }
  
      if (!tbxAttempt3.Text.All(char.IsDigit))
      {
          passValidation = false;
      }
  
  [Lines 15 to 19] Attempt 2 not all numbers?: The same check for the second box.
  [Lines 20 to 24] Attempt 3 not all numbers?: The same check for the third box.
  [Names in this code: tbxAttempt2, tbxAttempt3, passValidation]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxAttempt2 and picking it from the list]
Watch out Each check names a different box. Check you changed the 1 to 2, then to 3.
[Big button at the foot: I've done this ✓]

### Screen ch05#2-5. Show a message and empty the boxes if a check failed
Now every check is done. If passValidation is false, something was wrong.
[CODE CARD. Type this. The average button, part 5 of 8]
  Where: under part 4, inside btnCalculateAverage_Click
      if (passValidation == false)
      {
          MessageBox.Show("Ensure all entries are present and are number only");
          tbxAttempt1.Clear();
          tbxAttempt2.Clear();
          tbxAttempt3.Clear();
      }
  [Lines 25 to 26] Did a check fail?: Is passValidation false?
  [Lines 27 to 31] Say so and empty the boxes: A message box asks for numbers only. The three boxes are emptied.
  [Names in this code: passValidation, tbxAttempt1, tbxAttempt2, tbxAttempt3]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxAttempt3 and picking it from the list]
Watch out Two equals signs ask a question. One equals sign would change passValidation.
[Big button at the foot: I've done this ✓]

## Stage 3. Work out the average

### Screen ch05#3-1. Add the three attempts, divide by 3 and round
else runs when every box held a number. Now the average is worked out.
A box holds words. Convert.ToDouble turns them into a number that can have a point.
Math.Round(x, 2) keeps 2 numbers after the point. .ToString() turns the number back into words for the box.
[CODE CARD. Type this. The average button, part 6 of 8]
  Where: under part 5, inside the else
      else
      {
          double average = (Convert.ToDouble(tbxAttempt1.Text) + Convert.ToDouble(tbxAttempt2.Text) + Convert.ToDouble(tbxAttempt3.Text)) / 3;
          double roundedAv = Math.Round(average, 2);
  
          Global.average = roundedAv;
          tbxCalculateAverage.Text = Global.average.ToString();
  
  [Lines 32 to 34] Add and divide: else, then the three attempts are added and divided by 3. It is all one line.
  [Lines 35 to 36] Round it: roundedAv keeps 2 numbers after the point.
  [Lines 37 to 39] Keep it and show it: The average goes into Global.cs. Then the box beside the button shows it.
  [Names in this code: average, tbxAttempt1, tbxAttempt2, tbxAttempt3, roundedAv, Global.average, tbxCalculateAverage]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of double and picking it from the list]
Watch out The brackets round the three numbers matter. Without them only the last one is divided by 3.
[Big button at the foot: I've done this ✓]

### Screen ch05#3-2. Keep the three attempts and switch off this panel
Next, the average button notes the average is done and keeps the three attempts.
Convert.ToInt32 turns the words in a box into a whole number.
[CODE CARD. Type this. The average button, part 7 of 8]
  Where: under part 6, inside the else
          Global.averageCalculated = true;
          pnlSwimLengths.Enabled = false;
  
          Global.attempt1 = Convert.ToInt32(tbxAttempt1.Text);
          Global.attempt2 = Convert.ToInt32(tbxAttempt2.Text);
          Global.attempt3 = Convert.ToInt32(tbxAttempt3.Text);
  
  [Lines 40 to 42] Worked out. Switch off this panel: averageCalculated becomes true. The attempts panel switches off.
  [Lines 43 to 46] Keep the three attempts: Each attempt goes into its line in Global.cs as a whole number.
  [Names in this code: Global.averageCalculated, pnlSwimLengths, Global.attempt1, tbxAttempt1, Global.attempt2, tbxAttempt2, Global.attempt3, tbxAttempt3]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of Global.attempt1 and picking it from the list]
Watch out else opens with a curly bracket. Its closing curly bracket comes in part 8.
[Big button at the foot: I've done this ✓]

### Screen ch05#3-3. Switch on the quiz panel
Last, the average button moves the pupil on to the quiz.
[Animated diagram of frmDataEntry. Panels switched on: pnlSwimLengths. Then pnlQuizResult switches on.]
  Caption first: The average is worked out. The button is pressed.
  Caption: The attempts panel goes grey and switches off. The quiz panel switches on.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
[CODE CARD. Type this. The average button, part 8 of 8]
  Where: under part 7, inside the else
          pnlQuizResult.Enabled = true;
  
  [grey, already there]     }
  [grey, already there] }
  [Lines 47 to 48] Switch on the quiz panel: The quiz panel can now be clicked.
  [Lines 49 to 50] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Names in this code: pnlQuizResult]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlQuizResult and picking it from the list]
[Big button at the foot: I've done this ✓]

## Stage 4. Try your average button

### Screen ch05#4-1. Try every way through the average button
Run your program, log in and fill in the details. Then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Type a letter in one attempt box. Fill in the rest. Press the average button.
    How: A message asks for numbers only. The three boxes are empty.
    If not: Look at parts 3 to 5 on screens 2-3 to 2-5.  [button: Go there ›]
  [tick box] Must happen. Type 5, 6 and 7. Press the average button.
    How: The box beside the button shows 6.
    If not: Look at part 6 on screen 3-1.  [button: Go there ›]
  [tick box] Must happen. Run it again. Type 5, 6 and 8. Press the average button.
    How: The box shows 6.33.
    If not: Look at the rounding in part 6 on screen 3-1.  [button: Go there ›]
  [tick box] Must NOT happen. After the average appears, click in an attempt box and try to type.
    How: You must NOT be able to type in it.
    If not: If you can, look at part 7 on screen 3-2.  [button: Go there ›]
[Big button at the foot: Chapter 5 is done ✓]
