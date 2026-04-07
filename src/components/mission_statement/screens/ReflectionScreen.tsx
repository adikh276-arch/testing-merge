import ScreenWrapper from "@/components/mission_statement/ScreenWrapper";
import MissionButton from "@/components/mission_statement/MissionButton";
import ReflectionInput from "@/components/mission_statement/ReflectionInput";
import { MissionData } from "@/app/therapy/mission_statement/page";
import { useTranslation } from "react-i18next";

interface ReflectionScreenProps {
  data: MissionData;
  onChange: (partial: Partial<MissionData>) => void;
  onNext: () => void;
}

const ReflectionScreen = ({ data, onChange, onNext }: ReflectionScreenProps) => {
  const { t } = useTranslation();
  const canProceed = data.beingSomeoneWho.trim() && data.lifeFeelMore.trim();

  return (
    <ScreenWrapper screenKey="reflection">
      <div className="flex-1 space-y-8">
        <h1 className="text-[22px] font-heading text-foreground text-center">
          {t('reflection_title')}
        </h1>

        <ReflectionInput
          label={t('reflection_being_label')}
          placeholder={t('reflection_being_placeholder')}
          value={data.beingSomeoneWho}
          onChange={(e) => onChange({ beingSomeoneWho: e.target.value })}
        />

        <ReflectionInput
          label={t('reflection_life_label')}
          placeholder={t('reflection_life_placeholder')}
          value={data.lifeFeelMore}
          onChange={(e) => onChange({ lifeFeelMore: e.target.value })}
        />
      </div>

      <div className="pt-8 pb-4">
        <MissionButton onClick={onNext} disabled={!canProceed}>
          {t('reflection_create')}
        </MissionButton>
      </div>
    </ScreenWrapper>
  );
};

export default ReflectionScreen;
