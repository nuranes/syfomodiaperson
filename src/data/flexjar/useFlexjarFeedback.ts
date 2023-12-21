import { useMutation } from "@tanstack/react-query";
import { FLEXJAR_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";

export const useFlexjarFeedback = () => {
  const path = `${FLEXJAR_ROOT}/feedback/azure`;
  const postFlexjarFeedback = (feedback: FlexjarFeedbackDTO) =>
    post(path, feedback);

  return useMutation({
    mutationFn: postFlexjarFeedback,
  });
};

export interface FlexjarFeedbackDTO {
  feedbackId: string;
  feedback: string | null;
  svar: string | null;
  app: string;
}
