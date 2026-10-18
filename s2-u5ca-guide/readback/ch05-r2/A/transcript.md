# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 5. The average of three attempts
Under the title: Three numbers in, one average out, kept in Global.cs.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what your average button has

## Stage 2. Check the three boxes

### Screen ch05#2-1. Start the average button with passValidation set to true
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
  [Lines 37 to 39] Keep it and show it: The average goes into Global.cs, the file you made in chapter 3. Then the box beside the button shows it.
  [Names in this code: average, tbxAttempt1, tbxAttempt2, tbxAttempt3, roundedAv, Global.average, tbxCalculateAverage]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of double and picking it from the list]
Watch out The brackets round the three numbers matter. Without them only the last one is divided by 3.
[Big button at the foot: I've done this ✓]

### Screen ch05#3-2. Save the three attempts in Global.cs and switch off the attempts panel
Next, the average button notes the average is done. It saves the three attempts in Global.cs too.
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

## Stage 4. Try your average button
