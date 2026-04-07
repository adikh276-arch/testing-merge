import ScreenWrapper from "@/components/mission_statement/ScreenWrapper";
import MissionButton from "@/components/mission_statement/MissionButton";
import { useTranslation } from "react-i18next";

interface IntroScreenProps {
  onNext: () => void;
  onHistory: () => void;
}

const IntroScreen = ({ onNext, onHistory }: IntroScreenProps) => {
  const { t } = useTranslation();

  return (
    <ScreenWrapper screenKey="intro">
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <h1 className="text-[22px] font-heading text-foreground text-center">
          {t('intro_title')}
        </h1>

        <div className="space-y-5 text-[15px] font-body text-muted-foreground leading-[1.65] text-center">
          <p>
            {t('intro_p1')}
          </p>
          <p>
            {t('intro_p2')}
          </p>
          <p className="text-foreground/80 italic">{t('intro_breath')}</p>
          <p>{t('intro_no_wrong')}</p>
        </div>
      </div>

      <div className="pt-8 pb-4 space-y-3">
        <MissionButton onClick={onNext}>{t('intro_begin')}</MissionButton>
        <MissionButton variant="outline" onClick={onHistory}>
          {t('intro_past_reflections')}
        </MissionButton>
      </div>
    </ScreenWrapper>
  );
};

export default IntroScreen;
