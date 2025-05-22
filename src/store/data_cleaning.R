requiredPackages = c("lme4", "modelsummary", "sjPlot", "emmeans", "car", "psych",
                     "caret", "marginaleffects", "DHARMa", "modelsummary", "tidyverse", "ggsignif", "readxl", "dplyr") #dplyr should be at the end

for(p in requiredPackages){
  if(!require(p,character.only = TRUE)) install.packages(p)
  library(p,character.only = TRUE)
}

library(dplyr)
library(readxl)

getwd()

df <- read.csv("C:/Users/becky/Desktop/Year4/UROP data/mock_prolific.csv",skip = 1)
#df <- read_xlsx(file.choose())
print(names(df))

df <- df %>%
  mutate(Interest_recode = case_when(
    Interest == "Not interested at all" ~ 1,
    Interest == "Slightly interested" ~ 2,
    Interest == "Moderately interested" ~ 3,
    Interest == "Very interested" ~ 4,
    Interest == "Extremely interested" ~ 5,
    TRUE ~ NA_real_  # Handles any unexpected values
  ))

df <- df %>%
  mutate(EnjoyWordPuzzle_recode = case_when(
    EnjoyWordPuzzle == "Strongly disagree" ~ 1,
    EnjoyWordPuzzle == "Somewhat disagree" ~ 2,
    EnjoyWordPuzzle == "Neither agree nor disagree" ~ 3,
    EnjoyWordPuzzle == "Somewhat agree" ~ 4,
    EnjoyWordPuzzle == "Strongly agree" ~ 5,
    TRUE ~ NA_real_  # Handles any unexpected values
  ))

df <- df %>%
  mutate(EnjoyFlashcard_recode = case_when(
    EnjoyFlashcard == "Strongly disagree" ~ 1,
    EnjoyFlashcard == "Somewhat disagree" ~ 2,
    EnjoyFlashcard == "Neither agree nor disagree" ~ 3,
    EnjoyFlashcard == "Somewhat agree" ~ 4,
    EnjoyFlashcard == "Strongly agree" ~ 5,
    TRUE ~ NA_real_  # Handles any unexpected values
  ))

df <- df %>%
  mutate(WordPuzzleFreq_recode = case_when(
    WordPuzzleFreq == "Never" ~ 1,
    WordPuzzleFreq == "Have only played a few times" ~ 2,
    WordPuzzleFreq == "Once a month" ~ 3,
    WordPuzzleFreq == "Several times a month" ~ 4,
    WordPuzzleFreq == "Once a week" ~ 5,
    WordPuzzleFreq == "Several times a week" ~ 6,
    WordPuzzleFreq == "Once a day" ~ 7,
    WordPuzzleFreq == "Several times a day" ~ 8,
    TRUE ~ NA_real_  # Handles any unexpected values
  ))

df <- df %>%
  rename(isGame = game)

df %>% mutate(across(
  c("PROLIFIC_PID","Race","Age","Gender","Hispanic","Education","EngFirstLang","Experience"), as.factor))

df %>% mutate(across(c("Interest_recode","TotalTime","day","EnjoyWordPuzzle_recode","EnjoyFlashcard_recode","WordPuzzleFreq_recode", "isGame"), as.numeric))

print(df$WordPuzzleFreq_recode)

print(mean(df$Interest_recode))

df %>% count(EnjoyFlashcard_recode)

# datasummary_skim(df)

ggplot(df, aes(x = Race, y =WordPuzzleFreq)) + 
  geom_bar(stat = "summary", fun = "mean", position = "dodge")

getwd()

#############################

morse <- read_excel("C:/Users/becky/Desktop/Year4/UROP data/mock_morse_bee_results.xlsx")
print(names(morse))

morse <- morse %>%
  mutate(isGame = ifelse(isGame == TRUE, 1, 0))

# Group by PID, day, isGame, and hiveLetters to should the same day entry for 
# the same participant
grouped_morse <- morse %>%
  group_by(PID, day, isGame, hiveLetters) %>%
  summarise(
    total_guesses = n(),  # count the number of guesses
    unique_answers = n_distinct(userAnswer),  # count unique answers
    correct_count = sum(correctAnswer == userAnswer, na.rm = TRUE),  # count correct answers
    avg_morse_duration = mean(morseDuration, na.rm = TRUE),  # average Morse duration
    avg_answer_duration = mean(answerDuration, na.rm = TRUE),  # average answer duration
  ) %>%
  ungroup()

print(grouped_morse)

############################

# join using PID, isGame, and day
merged_data <- grouped_morse %>%
  inner_join(df, by = c("PID" = "PROLIFIC_PID", "isGame", "day"))

# Print the first few rows of to see
print((merged_data))

# save
write.csv(merged_data, "C:/Users/becky/Desktop/Year4/UROP data/merged_data.csv", row.names = FALSE)
